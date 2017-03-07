export default {
  context: null,
  pluginFolderPath: '',

  getPluginFolderPath (context) {
    let split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
  },

  initWithContext (context) {
    this.context = context;
    this.pluginFolderPath = this.getPluginFolderPath(context);
  }
}