import {
  mountChildFibers,
  reconcileChildFibers,
} from './childFibers'
import {
  UpdateQueue,
  processUpdateQueue,
} from './updateQueue'
import {
  HostComponent,
  HostRoot,
  HostText,
} from './workTag'
import { FiberNode } from './fiber'
import { ReactElementType } from 'shared/ReactTypes'

export const beginWork = (
  wip: FiberNode
): FiberNode | null => {
  // 比较，返回子 fiberNode
  switch (wip.key) {
    case HostRoot:
      updateHostRoot(wip)
      break

    case HostComponent:
      updateHostCompoent(wip)
      break
    case HostText:
      return null
    default:
      if (__DEV__) {
        console.warn('beginWork 发生错误')
      }
      break
  }
  return null
}

function updateHostCompoent(wip) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.menoizeState
  const updateQueue =
    wip.updateQueue as UpdateQueue<Element>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null
  const { memoizedState } = processUpdateQueue(
    baseState,
    pending
  )
  wip.menoizeState = memoizedState

  const nextChildren = wip.menoizeState

  reconcileChildren(wip, nextChildren)

  return wip.child
}

function reconcileChildren(
  wip: FiberNode,
  children?: ReactElementType
) {
  const current = wip.alternate
  if (current) {
    // update
    wip.child = reconcileChildFibers(
      wip,
      current?.child,
      children
    )
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}
