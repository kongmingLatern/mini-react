# 从 0 开始的 React 源码书写

## Purpose

This project will write React step by step, and then compare the source code of React.

## 项目结构

```
.
├── README.md
├── dist
├── example
│   └── demo
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       │   └── vite.svg
│       ├── src
│       │   └── main.jsx
│       └── vite.config.js
├── package.json
├── packages
│   ├── react
│   │   ├── index.ts
│   │   ├── jsx-dev-runtime.ts
│   │   ├── package.json
│   │   └── src
│   │       ├── currentDispatcher.ts
│   │       └── jsx.ts
│   ├── react-dom
│   │   ├── client.ts
│   │   ├── index.ts
│   │   ├── package.json
│   │   └── src
│   │       ├── hostConfig.ts
│   │       └── root.ts
│   ├── react-reconciler
│   │   ├── package.json
│   │   └── src
│   │       ├── beginWork.ts
│   │       ├── childFibers.ts
│   │       ├── commitWork.ts
│   │       ├── completeWork.ts
│   │       ├── fiber.ts
│   │       ├── fiberFlags.ts
│   │       ├── fiberHooks.ts
│   │       ├── fiberReconciler.ts
│   │       ├── reconciler.d.ts
│   │       ├── updateQueue.ts
│   │       ├── workLoop.ts
│   │       └── workTag.ts
│   └── shared
│       ├── ReactSymbols.ts
│       ├── ReactTypes.ts
│       ├── internals.ts
│       └── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── react-test-dev
│   └── test-fc
│       ├── index.html
│       └── main.tsx
├── scripts
│   ├── rollup
│   │   ├── dev.config.js
│   │   ├── react-dom.config .js
│   │   ├── react.config.js
│   │   └── utils.js
│   └── vite
│       └── vite.config.js
└── tsconfig.json


## Schedule

### react module

- [x] JSX 的转译
- [x] JSX 的打包，包括了 `JSXDEV` 和 `JSXDEV_RUNTIME` 的打包

### reconciler module

- [x] Fiber 架构的搭建
- [x] 状态的更新
- [x] mount 流程搭建
- [x] 实现 FunctionComponent
- [x] 实现 useState

### react-dom module

- [x] commit 阶段完成
- [x] Mutation 阶段完成
- [x] ReactDOM.render 完成
```
