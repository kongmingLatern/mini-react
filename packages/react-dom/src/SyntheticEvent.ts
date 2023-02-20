import { Container } from 'hostConfig'
import { Props } from 'shared/ReactTypes'

export const elementPropsKey = '__props'

const validEventTypeList = ['click']

type EventCallBack = (e: Event) => void

interface SyntheticEvent extends Event {
  __stopPropagation: boolean
}

interface Paths {
  capture: EventCallBack[]
  bubble: EventCallBack[]
}

export interface DOMElement extends Element {
  [elementPropsKey]: Props
}

export function updateFiberProps(node, props: Props) {
  node[elementPropsKey] = props
}

export function initEvent(
  container: Container,
  eventType: string
) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn('当前项目不支持', eventType, '事件')
    return
  }
  if (__DEV__) {
    console.log('初始化事件', eventType)
  }

  container.addEventListener(eventType, e => {
    dispatchEvent(container, eventType, e)
  })
}

function createSyntheticEvent(e: Event): SyntheticEvent {
  const sytheticEvent = e as SyntheticEvent
  sytheticEvent.__stopPropagation = false
  const originStopPropagation = e.stopPropagation

  sytheticEvent.stopPropagation = () => {
    sytheticEvent.__stopPropagation = true
    if (originStopPropagation) {
      originStopPropagation()
    }
  }
  return sytheticEvent
}

function dispatchEvent(
  container: Container,
  eventType: string,
  e
) {
  const targetElement = e.target
  // 1. 收集沿途的事件
  if (targetElement === null) {
    console.warn('不存在target', e)
    return
  }
  const { bubble, capture } = collectPaths(
    targetElement,
    container,
    eventType
  )
  // 2. 构造合成事件
  const se = createSyntheticEvent(e)
  // 3. 遍历 captrue
  triggerEventFlow(capture, se)
  if (!se.__stopPropagation) {
    // 4. 遍历 bubble
    triggerEventFlow(bubble, se)
  }
}

function triggerEventFlow(
  paths: EventCallBack[],
  se: SyntheticEvent
) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i]
    callback.call(null, se)
    if (se.__stopPropagation) {
      break
    }
  }
}

function getEventCallbackNameFromEventType(
  eventType: string
): string[] | undefined {
  return {
    click: ['onClickCapture', 'onClick'],
  }[eventType]
}

function collectPaths(
  targetElement: DOMElement,
  container: Container,
  eventType: string
) {
  const paths: Paths = {
    capture: [],
    bubble: [],
  }
  while (targetElement && targetElement !== container) {
    // 收集
    const elementProps = targetElement[elementPropsKey]
    if (elementProps) {
      const callbackNameList =
        getEventCallbackNameFromEventType(eventType)
      if (callbackNameList) {
        callbackNameList.forEach((callbackName, i) => {
          const eventCallback = elementProps[callbackName]
          if (eventCallback) {
            if (i === 0) {
              // capture
              paths.capture.unshift(eventCallback)
            } else {
              paths.bubble.push(eventCallback)
            }
          }
        })
      }
    }
    targetElement = targetElement.parentNode as DOMElement
  }
  return paths
}
