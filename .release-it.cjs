module.exports = {
  hooks: {
    "before:init": ["cd .. && pnpm run build"],
    "after:bump": [
      "node ./scripts/zip.mjs",
      "git add .",
    ],
    "after:release":
      "echo Successfully released obsidian plugin ${name} v${version} to ${repo.repository}.",
  },
  git: {
    commitMessage: "chore: release obsidian plugin v${version}",
    tagName: "${version}",
    tagAnnotation: "Release Obsidian Plugin v${version}",
    addUntrackedFiles: true,
  },
  plugins: {
    // "@release-it/conventional-changelog": {
    //   preset: "angular",
    //   infile: "CHANGELOG.md",
    // },
    "./scripts/ob-bumper.mjs": {
      indent: 2,
      copyTo: ".",
    },
  },
  npm: {
    publish: false,
  },
  github: {
    release: true,
    assets: [
      "dist/main.js",
      "dist/manifest.json",
      "dist/styles.css",
      "dist/thino-${version}.zip",
    ],
    proxy: process.env.HTTPS_PROXY,
    releaseName: "${version}",
  },
};
