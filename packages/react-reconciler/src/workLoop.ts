import { FiberNode } from './fiber'
import { completeWork } from './completeWork'
import { beginWork } from './beginWork'
let workInProgress: FiberNode | null = null

function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber
}

function renderRoot(root: FiberNode) {
  // 初始化
  prepareFreshStack(root)

  do {
    try {
      workLoop()
      break
    } catch (e) {
      console.warn('workLoop 发生错误', e)
      workInProgress = null
    }
  } while (true)
}
function workLoop() {
  while (workInProgress !== null) {
    perforUnitOfWork(workInProgress)
  }
}
function perforUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber)
  fiber.memoizeProps = fiber.pendingProps
  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber

  do {
    completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = node
  } while (node !== null)
}
