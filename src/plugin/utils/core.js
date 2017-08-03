export default {
  context: null,
  document: null,
  selection: null,
  sketch: null,

  pluginFolderPath: null,

  getPluginFolderPath (context) {
    let split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
  },

  initWithContext (context) {
    this.context = context;
    this.document = context.document || context.actionContext.document || MSDocument.currentDocument();
    this.selection = this.document.selectedLayers();
    this.sketch = this.context.api();

    this.pluginFolderPath = this.getPluginFolderPath(context);

    // Load your cocoa frameworks here :)
    this.loadFramework('SketchPluginBoilerplate', 'SPBWebViewMessageHandler');
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
