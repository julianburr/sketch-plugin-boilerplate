process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const chalk = require('chalk');
const { logError } = require('./utils/build');

const buildPlugin = require('./plugin/build');
const buildWebView = require('./webview/build');
const bundlePlugin = require('./plugin/bundle');
const {
  getCommits,
  getRecomendedVersion,
  updateManifest,
  release: releasePlugin
} = require('./plugin/release');

const Confirm = require('prompt-confirm');

// Analyze process arguments
const ARGS = process.argv.splice(2);

// --git
const withGit = ARGS.find(a => a === '--git');

// --patch|minor|major|pre|prerelease
let forceBump = null;
if (ARGS.find(a => a === '--patch')) {
  forceBump = 'patch';
} else if (ARGS.find(a => a === '--minor')) {
  forceBump = 'minor';
} else if (ARGS.find(a => a === '--major')) {
  forceBump = 'major';
} else if (ARGS.find(a => a === '--pre' || a === '--prerelease')) {
  forceBump = 'prerelease';
}

// --version x.x.x
let forceVersion = null;
if (ARGS.find(a => a === '--version' || a === '-v')) {
  const index = ARGS.findIndex(a => a === '--version' || a === '-v');
  forceVersion = ARGS[index + 1];
}

let forceRelease = false;
if (ARGS.find(a => a === '--force' || a === '-f')) {
  forceRelease = true;
}

console.log(chalk.bold('Release new plugin version'));
console.log();

console.log('Reading latest commits');

getCommits({
  onError: logError,

  onSuccess: commits => {
    if (!commits.length && !forceRelease) {
      console.log(chalk.yellow('  ✖︎ No new commits found.'));
      console.log();
      console.log(
        chalk.grey.italic(
          'Release stopped. If you still want to release a new version, add --force to the cli command.'
        )
      );
      return;
    }

    console.log(
      chalk.grey(
        `  ${commits.length} new commit${commits.length === 1 ? '' : 's'} found`
      )
    );

    getRecomendedVersion({
      options: {
        forceBump,
        forceVersion
      },

      onError: logError,

      onSuccess: (currVersion, recVersion) => {
        console.log(
          chalk.grey(
            `  Recommended version: ${currVersion} -> ${chalk.bold.green(
              recVersion
            )}`
          )
        );

        const prompt = new Confirm('Do you want to continue?');
        console.log();

        prompt.run().then(doContinue => {
          if (!doContinue) {
            return;
          }

          console.log();
          console.log('Building and bundling plugin');

          updateManifest(recVersion);
          console.log(chalk.grey('  ✓ Plugins manifest.json updated'));

          buildPlugin({
            onError: logError,

            onSuccess: () => {
              console.log(chalk.grey('  ✓ Plugin compiled successfully'));
              buildWebView({
                onError: error => {
                  logError(error);
                },

                onSuccess: () => {
                  console.log(chalk.grey('  ✓ Web view compiled successfully'));

                  bundlePlugin({
                    onError: error => {
                      logError(error);
                    },

                    onSuccess: () => {
                      console.log(chalk.grey('  ✓ Created bundle'));
                      console.log();

                      console.log('Create release files');

                      releasePlugin(recVersion, {
                        options: {
                          git: withGit
                        },

                        onError: logError,

                        onChangelogUpdated: () => {
                          console.log(chalk.grey('  ✓ Changelog updated'));
                        },

                        onChangelogMarkdownCreated: () => {
                          console.log(
                            chalk.grey('  ✓ Created changelog markdown')
                          );
                        },

                        onBundleZipCreated: () => {
                          console.log(
                            chalk.grey('  ✓ Zipped new plugin bundle')
                          );
                        },

                        onAppcastXmlCreated: () => {
                          console.log(chalk.grey('  ✓ Created appcast.xml'));
                        },

                        onGitAdd: () => {
                          console.log(chalk.grey('  ✓ Ran `git add`'));
                        },

                        onGitCommit: () => {
                          console.log(chalk.grey('  ✓ Ran `git commit`'));
                        },

                        onGitTag: () => {
                          console.log(chalk.grey('  ✓ Ran `git tag`'));
                        },

                        onSuccess: () => {
                          console.log();
                          console.log(chalk.green.bold('RELEASE DONE!'));
                          console.log();
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  }
});
