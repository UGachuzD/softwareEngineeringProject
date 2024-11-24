module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Usar el preset de Expo
    plugins: [
      [
        "module:react-native-dotenv", // Soporte para variables de entorno
        {
          "moduleName": "@env",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
        }
      ],
      [
        "inline-dotenv", // Soporte adicional para Jest con variables de entorno
        {
          "path": ".env"
        }
      ]
    ]
  };
};
