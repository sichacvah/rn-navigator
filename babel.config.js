module.exports = function (api) {
  api && api.cache(false);
  return {
    presets: [
      "module:metro-react-native-babel-preset"
    ],
    env: {
      test: {
        presets: [
          "module:metro-react-native-babel-preset"
        ],
        plugins: [
          "@babel/plugin-proposal-class-properties"
        ]
      }
    }
  };
}