import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { Props, ReactElementType } from 'shared/ReactTypes'
import {
  createFiberFromElement,
  createWorkInProgress,
  FiberNode,
} from './fiber'
import { ChildDeletion, Placement } from './fiberFlags'
import { HostText } from './workTag'

function ChildReconciler(shouleTrackEffects: boolean) {
  function deleteChild(
    returnFiber: FiberNode,
    childToDelete: FiberNode
  ) {
    if (!shouleTrackEffects) {
      return
    }
    const deletions = returnFiber.deletions

    if (deletions === null) {
      returnFiber.deletions = [childToDelete]
      returnFiber.flags |= ChildDeletion
    } else {
      deletions.push(childToDelete)
    }
  }
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    const key = element.key
    work: if (currentFiber) {
      // update
      if (currentFiber.key === key) {
        // key 相同
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          if (currentFiber.type === element.type) {
            // type 相同
            const existing = useFiber(
              currentFiber,
              element.props
            )
            existing.return = returnFiber
            return existing
          }
          // 删掉旧的
          deleteChild(returnFiber, currentFiber)
          break work
        } else {
          if (__DEV__) {
            console.warn('还未实现的 react 类型', element)
          }
          break work
        }
      } else {
        // 删掉旧的
        deleteChild(returnFiber, currentFiber)
      }
    }
    // 根据 element 创建 fiber
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function useFiber(
    fiber: FiberNode,
    pendingProps: Props
  ): FiberNode {
    const clone = createWorkInProgress(fiber, pendingProps)
    clone.index = 0
    clone.sibling = null
    return clone
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
    // Implement
    if (currentFiber) {
      // update
      if (currentFiber.tag === HostText) {
        const existing = useFiber(currentFiber, { content })
        existing.return = returnFiber
        return existing
      }
      deleteChild(returnFiber, currentFiber)
    }
    const fiber = new FiberNode(HostText, { content }, null)
    fiber.return = returnFiber
    return fiber
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouleTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement
    }
    return fiber
  }

  return function reconcileChildrenFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElementType
  ) {
    // 判断当前 fiber 的类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFiber,
              newChild
            )
          )

        default:
          if (__DEV__) {
            console.warn('reconcileChildrenFibers 发生错误')
          }
          break
      }
    }
    // HostText
    if (
      typeof newChild === 'string' ||
      typeof newChild === 'number'
    ) {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFiber,
          newChild
        )
      )
    }

    // 兜底删除
    if (currentFiber) {
      deleteChild(returnFiber, currentFiber)
    }

    if (__DEV__) {
      console.warn('未实现的 reconcile 类型', newChild)
    }
    return null
  }
}

export const reconcileChildFibers = ChildReconciler(true)

export const mountChildFibers = ChildReconciler(false)
