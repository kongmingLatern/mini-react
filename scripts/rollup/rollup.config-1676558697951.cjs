'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs');
var ts = require('rollup-plugin-typescript2');
var cjs = require('@rollup/plugin-commonjs');
var replace = require('@rollup/plugin-replace');
var generatePackageJson = require('rollup-plugin-generate-package-json');
var alias = require('@rollup/plugin-alias');

const pkgPath$2 = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(
  __dirname,
  '../../dist/node_modules'
);

function resolvePkgPath(pkgName, isDist) {
  console.log(pkgName + ' isDist: ' + isDist);
  if (isDist) {
    return `${distPath}/${pkgName}`
  }
  return `${pkgPath$2}/${pkgName}`
}
function getPackageJson(pkgName) {
  // ... 包路径
  const path = `${pkgPath$2}/${pkgName}/package.json`;
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str)
}

function getBaseRollupPlugins({
  alias = {
    __DEV__: true,
    preventAssignment: true,
  },
  typescript = {},
} = {}) {
  return [replace(alias), cjs(), ts(typescript)]
}

const { name: name$1, module: module$2, peerDependencies } =
  getPackageJson('react-dom');
const pkgPath$1 = resolvePkgPath(name$1);

const pkgDistPath$1 = resolvePkgPath(name$1, 'dist');

var reactDomConfig = [
  // react-dom
  {
    input: `${pkgPath$1}/${module$2}`,
    output: [
      {
        file: `${pkgDistPath$1}/index.js`,
        name: 'ReactDOM',
        // 兼容 esm 和 cjs
        format: 'umd',
      },
      {
        file: `${pkgDistPath$1}/client.js`,
        name: 'client',
        format: 'umd',
      },
    ],
    external: [...Object.keys(peerDependencies)],
    plugins: [
      ...getBaseRollupPlugins(),
      // webpack resolve alias
      alias({
        entries: {
          hostConfig: `${pkgPath$1}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: pkgPath$1,
        outputFolder: pkgDistPath$1,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          peerDependencies: {
            react: version,
          },
          main: 'index.js',
        }),
      }),
    ],
  },
  // test-utils
  {
    input: `${pkgPath$1}/test-utils.ts`,
    output: [
      {
        file: `${pkgDistPath$1}/test-utils.js`,
        name: 'testUtils',
        format: 'umd',
      },
    ],
    external: ['react-dom', 'react'],
    plugins: getBaseRollupPlugins(),
  },
];

const { name, module: module$1 } = getPackageJson('react');
const pkgPath = resolvePkgPath(name);

const pkgDistPath = resolvePkgPath(name, 'dist');

var reactConfig = [
  // react
  {
    input: `${pkgPath}/${module$1}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      // 兼容 esm 和 cjs
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        // 兼容 esm 和 cjs
        format: 'umd',
      },
      // jsx-dev-runtime
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        // 兼容 esm 和 cjs
        format: 'umd',
      },
    ],
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
];

var dev_config = () => {
  return [...reactDomConfig, ...reactConfig]
};

exports.default = dev_config;
