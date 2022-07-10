const { join } = require('path');
const { existsSync: isExists, writeFileSync: write, readFileSync: read } = require('fs');

const eslintPath = findNearestEslintPackage();
const eslintPackageJson = join(eslintPath, 'package.json');

const packageJson = JSON.parse(
  read(eslintPackageJson, {
    encoding: 'utf-8',
  })
);

const fileName = 'eslint-plugin-decorator-position';
const filePath = join(eslintPath, `${fileName}.js`);
write(
  filePath,
  `module.exports = {
      CLIEngine: require("./lib/cli-engine").CLIEngine,
    }`
);

if (packageJson.exports) {
  packageJson.exports[`./${fileName}`] = `./${fileName}.js`;
}

write(eslintPackageJson, JSON.stringify(packageJson));

function findNearestEslintPackage() {
  let dir = __dirname;
  while (!isExists(join(dir, 'node_modules', 'eslint'))) {
    if (dir === join(dir, '..')) {
      throw new Error('Cannot found Eslint package');
    }
    dir = join(dir, '..');
  }
  return join(dir, 'node_modules', 'eslint');
}
