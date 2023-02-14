import {
  MutationMask,
  NoFlags,
  Placement,
} from './fiberFlags'
import { FiberNode, FiberRootNode } from './fiber'
import {
  HostComponent,
  HostRoot,
  HostText,
} from './workTag'
import {
  appendChildToContainer,
  Container,
} from 'react-dom/src/hostConfig'
let nextEffect: FiberNode | null = null
export const commitMutationEffects = (
  finishedWork: FiberNode
) => {
  nextEffect = finishedWork
  while (nextEffect) {
    // 向下遍历
    const child: FiberNode | null = nextEffect.child

    if (
      (nextEffect.subtreeFlags & MutationMask) !==
        NoFlags &&
      child !== null
    ) {
      nextEffect = child
    } else {
      // 向上遍历 DFS
      up: while (nextEffect) {
        commitMutationEffectsOnFiber(nextEffect)
        const sibling: FiberNode | null = nextEffect.sibling

        if (sibling !== null) {
          nextEffect = sibling
          break up
        }

        nextEffect = nextEffect.return
      }
    }
  }
}

function commitMutationEffectsOnFiber(
  finishedWork: FiberNode
) {
  const flags = finishedWork.flags
  // Implement
  if ((flags & MutationMask) !== NoFlags) {
    commitPlacement(finishedWork)
    finishedWork.flags &= ~Placement
  }
  // flags Update
  // flags ChildDeletion
}

function commitPlacement(finishedWork: FiberNode) {
  if (__DEV__) {
    console.warn('执行 Placement 操作')

    // parent DOM
    const hostParent = getHostParent(finishedWork)
    // finishedWork ~~ DOM append parent DOM
    if (hostParent) {
      appendPlacementNodeIntoContainer(
        finishedWork,
        hostParent
      )
    }
  }
}

function getHostParent(fiber: FiberNode): Container | null {
  let parent = fiber.return

  while (parent) {
    const parentTag = parent.tag
    if (parentTag === HostComponent) {
      return parent.stateNode as Container
    }
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container
    }
    parent = parent.return
    if (__DEV__) {
      console.warn('未处理的 getHostParent')
    }
  }
  return null
}
function appendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container
) {
  if (
    finishedWork.tag === HostComponent ||
    finishedWork.tag === HostText
  ) {
    appendChildToContainer(
      hostParent,
      finishedWork.stateNode
    )
    return
    // appendInitialChild(hostParent, finishedWork.stateNode)
  }
  const child = finishedWork.child
  if (child) {
    appendPlacementNodeIntoContainer(child, hostParent)
    let sibling = child.sibling
    while (sibling) {
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}
