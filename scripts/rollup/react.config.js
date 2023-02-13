import {
  getPackageJson,
  resolvePkgPath,
  getBaseRollupPlugins,
} from './utils'

const { name, module } = getPackageJson('react')
const pkgPath = resolvePkgPath(name)

const pkgDistPath = resolvePkgPath(name, 'dist')

export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      // 兼容 esm 和 cjs
      format: 'umd',
    },
    plugins: getBaseRollupPlugins(),
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        // 兼容 esm 和 cjs
        formate: 'umd',
      },
      // jsx-dev-runtime
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        // 兼容 esm 和 cjs
        formate: 'umd',
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
]
