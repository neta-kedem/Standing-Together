module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '../../static/[name].[ext]'
          }
        }
      ]
    })
//   useFileSystemPublicRoutes: false

    return config
  }
}
