import {
  getPackageJson,
  resolvePkgPath,
  getBaseRollupPlugins,
} from './utils'

import generatePackageJson from 'rollup-plugin-generate-package-json'
import alias from '@rollup/plugin-alias'

const { name, module, peerDependencies } =
  getPackageJson('react-dom')
const pkgPath = resolvePkgPath(name)

const pkgDistPath = resolvePkgPath(name, 'dist')

export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'ReactDOM',
        // 兼容 esm 和 cjs
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/client.js`,
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
  // test-utils
  {
    input: `${pkgPath}/test-utils.ts`,
    output: [
      {
        file: `${pkgDistPath}/test-utils.js`,
        name: 'testUtils',
        format: 'umd',
      },
    ],
    external: ['react-dom', 'react'],
    plugins: getBaseRollupPlugins(),
  },
]
