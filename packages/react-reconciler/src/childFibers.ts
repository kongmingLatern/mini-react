import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { ReactElementType } from 'shared/ReactTypes'
import { createFiberFromElement, FiberNode } from './fiber'
import { Placement } from './fiberFlags'
import { HostText } from './workTag'

function ChildReconciler(shouleTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    // 根据 element 创建 fiber
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    content: string | number
  ) {
    // Implement
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

    if (__DEV__) {
      console.warn('未实现的 reconcile 类型', newChild)
    }
    return null
  }
}

export const reconcileChildFibers = ChildReconciler(true)

export const mountChildFibers = ChildReconciler(false)
