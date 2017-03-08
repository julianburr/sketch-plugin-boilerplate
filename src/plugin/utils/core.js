export default {
  context: null,
  document: null,
  selection: null,
  sketch: null,

  pluginFolderPath: null,

  frameworks: {
    SketchPluginBoilerplate: {
      SPBWebViewMessageHandler: 'SPBWebViewMessageHandler'
    }
  },

  getPluginFolderPath (context) {
    let split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
  },

  initWithContext (context) {
    log('initWithContext');
    this.context = context;
    this.document = context.document || context.actionContext.document || MSDocument.currentDocument();
    this.selection = this.document.findSelectedLayers();
    this.sketch = this.context.api();

    this.pluginFolderPath = this.getPluginFolderPath(context);

    this.loadFrameworks();
    log('loaded');
    log(SPBWebViewMessageHandler);
  },

  loadFrameworks () {
    for (let framework in this.frameworks) {
      for (let className in this.frameworks[framework]) {
        const test = this.loadFramework(framework, this.frameworks[framework][className]);
        log('test');
        log(test);
      }
    }
  },

  loadFramework (frameworkName, frameworkClass) {
    log('Loading framework');
    log(frameworkName);
    log(frameworkClass);
    if (Mocha && NSClassFromString(frameworkClass) == null) {
      const frameworkDir = `${this.pluginFolderPath}/Contents/Resources/frameworks/`;
      log(`frameworkDir=${frameworkDir}`);
      log(this.context.scriptPath);
      const mocha = Mocha.sharedRuntime();
      return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
    }
    return true;
  }
};
