import {
  getPackageJson,
  resolvePkgPath,
  getBaseRollupPlugins,
} from './utils'

import generatePackageJson from 'rollup-plugin-generate-package-json'
import alias from '@rollup/plugin-alias'

const { name, module } = getPackageJson('react-dom')
const pkgPath = resolvePkgPath(name)

const pkgDistPath = resolvePkgPath(name, 'dist')

export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'index.js',
        // 兼容 esm 和 cjs
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'client.js',
        format: 'umd',
      },
    ],
    plugins: [
      ...getBaseRollupPlugins(),
      // webpack resolve alias
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
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
]
