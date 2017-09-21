const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const chalk = require('chalk');
const conventionalRecommendedBump = require('conventional-recommended-bump');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const gitlog = require('gitlog');
const Confirm = require('prompt-confirm');
const archiver = require('archiver');

const paths = require('../../config/plugin/paths');

// Escaping e.g. for binary paths
function escape (string) {
  return string.replace(/ /g, '\\ ').replace(/\n/g, '');
}

// Get all binary paths necessary for defined steps
const GIT_BIN = escape(execSync('which git').toString());

// GET all necessary file paths
const CL_JSON_PATH = paths.changelog;
const CL_MD_PATH = paths.changelogMarkdown;
const APPCAST_XML_PATH = paths.appcast;

const PLUGIN_PATH = paths.bundle;
const BUNDLE_DIR = paths.bundles;

const MANIFEST_PATH = paths.manifest;

const PUBLIC_PLUGIC_BASE_URL =
  'https://s3-ap-southeast-2.amazonaws.com/satchel-app-beta/plugin';

const COMMIT_TYPES_JSON = path.resolve(
  __dirname,
  '../../node_modules/conventional-commit-types/index.json'
);

function getCommitTypes () {
  let types = {};
  if (fs.existsSync(COMMIT_TYPES_JSON)) {
    types = fs.readJsonSync(COMMIT_TYPES_JSON).types;
  }
  return types;
}

function getManifestJson () {
  let manifestJson = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifestJson = fs.readJsonSync(MANIFEST_PATH);
  }
  return manifestJson;
}

function getChangelogJson () {
  let clJson = {};
  if (fs.existsSync(CL_JSON_PATH)) {
    clJson = fs.readJsonSync(CL_JSON_PATH);
  }
  return clJson;
}

function getLatestChangelogCommit (version, clJson) {
  if (!clJson || !Object.keys(clJson).length) {
    return null;
  }
  let lastHash = null;
  const commits = clJson[version].commits;
  if (!commits) {
    return null;
  }
  const lastCommit = commits[0];
  return lastCommit ? lastCommit.hash || null : null;
}

function updateChangelogJson (nextVersion, newCommits, currClJson) {
  const newClJson = Object.assign({}, currClJson, {
    [nextVersion]: {
      commits: newCommits,
      ts: new Date().getTime()
    }
  });
  fs.writeFileSync(CL_JSON_PATH, JSON.stringify(newClJson, null, 2));
  return newClJson;
}

function createChangelogMarkdown (clJson) {
  const fmtDate = ts => {
    const date = new Date(ts);
    return `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).substr(
      -2
    )}-${('00' + date.getDate()).substr(-2)}`;
  };
  const md = `
# Changelog

${Object.keys(clJson).map(
    version => `
## v${version} (${fmtDate(clJson[version].ts)})

${clJson[version].commits
      .filter(commit => commit.type)
      .map(commit => ` * \`${commit.type.title}\` ${commit.subject}`)
      .join('\n')}
`
  )}`;
  fs.writeFileSync(CL_MD_PATH, md);
}

function createAppcastXML (clJson, manifest) {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle"  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${manifest.name}</title>
    <link>${manifest.appcast}</link>
    <description>${manifest.description}</description>
    <language>en</language>
    ${Object.keys(clJson)
      .map(
        version => `
    <item>
      <title>Version ${version}</title>
      <description>
        <![CDATA[
          <ul>${clJson[version].commits
            .map(
              commit => `
            <li>${commit.subject}</li>`
            )
            .join('')}
          </ul>
        ]]>
      </description>
      <enclosure url="${PUBLIC_PLUGIC_BASE_URL}/Satchel-${version}.zip" sparkle:version="${version}" />
    </item>`
      )
      .join('')}
  </channel>
</rss>`;
  fs.writeFileSync(APPCAST_XML_PATH, xml);
}

function createBundleZip (version) {
  return new Promise((resolve, reject) => {
    const base = path.basename(paths.bundle, '.sketchplugin');
    const zipName = `${base}-${version}.zip`;
    const latestName = `${base}-latest.zip`;

    let output = fs.createWriteStream(`${BUNDLE_DIR}/${zipName}`);
    let archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', function () {
      fs.copySync(`${BUNDLE_DIR}/${zipName}`, `${BUNDLE_DIR}/${latestName}`);
      resolve(archive);
    });

    archive.on('error', function (err) {
      reject(err);
    });

    archive.pipe(output);

    const clFilename = path.basename(CL_MD_PATH);
    archive.append(fs.createReadStream(CL_MD_PATH), { name: clFilename });
    archive.directory(PLUGIN_PATH, `${base}.sketchplugin`);

    archive.finalize();
  });
}

// Exported functions

function updateManifest (nextVersion) {
  const manifest = getManifestJson();
  const newManifest = Object.assign({}, manifest, { version: nextVersion });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2));
  return newManifest;
}

function getCommits ({
  options = {},
  onError = () => null,
  onSuccess = () => null
}) {
  options = Object.assign({}, { number: 50 }, options);
  gitlog({ repo: process.cwd(), number: options.number }, (err, result) => {
    if (err) {
      onError(new Error(err));
    } else {
      // Filter out release commits!
      let commits = result.filter(
        c => !c.subject.startsWith('chore(release): ')
      );
      // ...and add type by using prefix
      // TODO: use package to parse commit subject to commit type, for now hard coded
      const types = getCommitTypes();
      const typeKeys = Object.keys(types);
      commits = commits.map(commit => {
        let type = null;
        const withoutScope = commit.subject.match(
          `^(${typeKeys.join('|')}): (.*)`,
          'gi'
        );
        const withScope = commit.subject.match(
          `^(${typeKeys.join('|')})\\([^\\)]\\): (.*)`,
          'gi'
        );
        const key = commit.subject.match(`^(${typeKeys.join('|')})`);
        if (withoutScope) {
          commit.subject = withoutScope[2];
          type = withoutScope[1];
        } else if (withScope) {
          commit.subject = withScope[2];
          type = withScope[1];
        }
        return Object.assign({}, commit, {
          type: type ? Object.assign({}, types[type], { key: type }) : null
        });
      });
      onSuccess(commits);
    }
  });
}

function getRecomendedVersion ({
  options = {},
  onSuccess = () => null,
  onError = () => null
}) {
  const manifest = getManifestJson();
  const currVersion = manifest.version || '0.0.0';

  if (options.forceBump) {
    const forcedBump = semver.inc(currVersion, options.forceBump);
    onSuccess(currVersion, forcedBump);
    return;
  }

  if (options.forceVersion) {
    onSuccess(currVersion, options.forceVersion);
    return;
  }

  conventionalRecommendedBump({ preset: 'angular' }, function (err, result) {
    if (err) {
      onError(new Error(err));
    } else {
      const { releaseType } = result;
      const recVersion = semver.inc(currVersion, releaseType);
      onSuccess(currVersion, recVersion);
    }
  });
}

function release (
  version,
  {
    options = {},
    onError = () => null,
    onChangelogUpdated = () => null,
    onChangelogMarkdownCreated = () => null,
    onBundleZipCreated = () => null,
    onAppcastXmlCreated = () => null,
    onGitAdd = () => null,
    onGitCommit = () => null,
    onGitTag = () => null,
    onSuccess = () => null
  }
) {
  options = Object.assign({}, { git: false }, options);

  const manifest = getManifestJson();
  const clJson = getChangelogJson();

  // Update changelog.json
  getCommits({
    onError,

    onSuccess: newCommits => {
      const newClJson = updateChangelogJson(version, newCommits, clJson);
      onChangelogUpdated(newClJson);

      // Update CHANGELOG.md
      createChangelogMarkdown(newClJson);
      onChangelogMarkdownCreated();

      // Zip bundled plugin
      createBundleZip(version);
      onBundleZipCreated();

      // Update appcast.xml
      createAppcastXML(newClJson, manifest);
      onAppcastXmlCreated();

      if (options.git) {
        // git add changelog.json package.json CHANGELOG.md appcast.xml
        execSync(`${GIT_BIN} add changelog.json CHANGELOG.md appcast.xml`);
        onGitAdd();

        // git commit -m 'chore(release): {version}'
        execSync(`${GIT_BIN} commit -m 'chore(release): ${version}'`);
        onGitCommit();

        // git tag -a v{version} -m 'Version {version}'
        execSync(`${GIT_BIN} tag -a v${version} -m 'Version ${version}'`);
        onGitTag();
      }
    }
  });
}

module.exports = {
  updateManifest,
  getCommits,
  getRecomendedVersion,
  release
};
