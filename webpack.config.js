const path = require('path');

module.exports = {
  entry: './main.js',  // Entry point for the app
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Optional if you use ES6+
      },
    ],
  },
};
