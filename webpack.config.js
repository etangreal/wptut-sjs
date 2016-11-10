
// NODE
const path = require('path');

// PLUGINS
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

// CUSTOM
const parts = require('./libs/parts');

const pkg = require('./package.json');

// VARIABLES
const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    style: PATHS.style,
    app: PATHS.app,

    // vendor: Object.keys(pkg.dependencies),
    // vendor: ['react'],
    // css: PATHS.app + '/main.css'
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',

    // Modify the name of the generated sourcemap file.
    // You can use [file], [id], and [hash] replacements here.
    // The default option is enough for most use cases.
    sourceMapFilename: '[file].map', // Default

    // This is the sourcemap filename template. It's default format
    // depends on the devtool option used. You don't need to modify this
    // often.
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {

  case 'build':
    console.log('this is webpack "build"');
  case 'stats':
    console.log('this is webpack "stats"');
    config = merge(
        common,
        { 
            devtool: 'source-map',
            output: {
                path: PATHS.build,
                // Tweak this to match your GitHub project name
                publicPath: '/webpack-demo/',

                filename: '[name].[chunkhash].js',

                // This is used for `require.ensure`. The setup
                // will work without but this is useful to set.
                chunkFilename: '[chunkhash].js'
            }
        },

        parts.clean(PATHS.build), // path.join(PATHS.build, '*')
        parts.setFreeVariable(
            'process.env.NODE_ENV',
            'production'
        ),
        parts.extractBundle({
            name: 'vendor',
            entries: ['react']
        }),
        parts.minify(),

        parts.extractCSS(PATHS.style),
        // parts.setupCSS(PATHS.style)
        parts.purifyCSS([PATHS.app])
    );
    break;

  default:
    console.log('this is webpack "default"');
    config = merge(
        common,
        { 
            devtool: 'eval-source-map' 
        },

        parts.minify(),
        parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT
        }),
        parts.setupCSS(PATHS.style)
    );
}

module.exports = validate(config, {
  quiet: true
});