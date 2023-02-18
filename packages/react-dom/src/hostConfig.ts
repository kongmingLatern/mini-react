import { HostText } from './../../react-reconciler/src/workTag'
import { FiberNode } from './../../react-reconciler/src/fiber'
export type Container = Element
export type Instance = Element
export type TextInstance = Text

export const createInstance = (
  type: string,
  props?: any
): Instance => {
  // TODO: 处理 Props
  const element = document.createElement(type)
  return element
}

export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  if (typeof child === 'string') {
    parent.appendChild(createTextInstance(child))
  } else {
    parent.appendChild(child)
  }
}

export const createTextInstance = (content: string) => {
  return document.createTextNode(content)
}

export const appendChildToContainer = appendInitialChild

export function commitUpdate(fiber: FiberNode) {
  switch (fiber.tag) {
    case HostText: // HostText
      const text = fiber.memoizedProps.content
      return commitTextUpdate(fiber.stateNode, text)

    default:
      if (__DEV__) {
        console.warn('未处理的 commitUpdate', fiber)
      }
      break
  }
}

export function commitTextUpdate(
  textInstance: TextInstance,
  content: string
) {
  textInstance.textContent = content
}

export function removeChild(
  child: Instance | TextInstance,
  container: Container
) {
  container.removeChild(child)
}
