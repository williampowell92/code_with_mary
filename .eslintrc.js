module.exports = {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    },
    "rules": {
      "func-names": 0,
      "no-new": 0,
      "comma-dangle": 0,
      "no-use-before-define": 0,
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
    }
};
