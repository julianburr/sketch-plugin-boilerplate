import { FetchCore } from 'sketch-fetch';

export default {
  context: null,
  document: null,
  selection: null,
  sketch: null,

  pluginFolderPath: null,

  frameworks: {
    SketchPluginBoilerplate: {
      SPBWebViewMessageHandler: 'SPBWebViewMessageHandler',
    },
  },

  getPluginFolderPath (context) {
    let split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
  },

  initWithContext (context) {
    this.context = context;
    this.document = context.document || context.actionContext.document || MSDocument.currentDocument();
    this.selection = this.document.findSelectedLayers();
    this.sketch = this.context.api();

    this.pluginFolderPath = this.getPluginFolderPath(context);

    this.loadFrameworks();
    FetchCore.initWithContext(this.context, 'sketch-plugin-boilerplate');
  },

  loadFrameworks () {
    for (let framework in this.frameworks) {
      for (let className in this.frameworks[framework]) {
        this.loadFramework(framework, this.frameworks[framework][className]);
      }
    }
  },

  loadFramework (frameworkName, frameworkClass) {
    if (Mocha && NSClassFromString(frameworkClass) == null) {
      const frameworkDir = `${this.pluginFolderPath}/Contents/Resources/frameworks/`;
      const mocha = Mocha.sharedRuntime();
      return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
    }
    return true;
  }
};
