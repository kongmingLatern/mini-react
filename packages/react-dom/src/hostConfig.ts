export type Container = Element
export type Instance = Element

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
