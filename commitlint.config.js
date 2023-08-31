/**
 * commit lint config
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "scope-case": [0, "never"],
  },
};
