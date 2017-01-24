module.exports = {
  presets: ['react-app'],
  plugins: [
    'transform-object-rest-spread',
    ['module-resolver', {
      alias: {
        webview: './src/webview',
        components: './src/webview/js/components',
        assets: './src/webview/assets',
        styles: './src/webview/scss'
      }
    }]
  ],
  // exclude: 'node_modules/**'
}