module.exports = {
  testEnvironment: 'node',
  testMatch: [
    "**/scripts/**/*.test.mjs"
  ],
  transform: {
    "^.+\.mjs$": ["babel-jest", { presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"] }],
  },
};