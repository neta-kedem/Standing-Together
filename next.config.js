let assetsOptions = {};
if('production' === process.env.NODE_ENV) {
  assetsOptions = {
    name: '../../static/[name].[ext]'
  }
}

module.exports = {
  useFileSystemPublicRoutes:false,
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: assetsOptions
        }
      ]
    });

    return config
  }
};
