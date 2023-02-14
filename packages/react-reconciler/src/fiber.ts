import { ReactElementType } from './../../shared/ReactTypes';
import { Props, Key, Ref } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
import { FunctionComponent, HostComponent, WorkTag } from './workTag';
export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	pendingProps: Props;
	memoizeProps: Props;
	menoizeState: any;
	type: any;
	ref: Ref;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	alternate: FiberNode | null;
	flags: Flags;
	subtreeFlags: Flags;
	updateQueue: unknown;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		// 保存 Dom
		this.stateNode = null;
		// FunctionComponent
		this.type = null;

		/** 构成树状结构 **/

		// 指向父 fiberNode
		this.return = null;
		// 指向兄弟 fiberNode
		this.sibling = null;
		this.child = null;
		this.index = 0;

		/** 作为工作单元 **/
		this.pendingProps = pendingProps;
		// 工作之后的 props
		this.memoizeProps = null;
		this.menoizeState = null;
		this.updateQueue = null;

		this.ref = null;

		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishWork = null;
	}
}

export const createWorkInProcess = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizeProps = current.memoizeProps;
	wip.menoizeState = current.menoizeState;
	return wip;
};

export function createFiberFromElement(element: ReactElementType) {
	const { $$typeof: type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;
	if (typeof type === 'string') {
		// <div></div> => type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的 type 类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);

	fiber.type = type;
	return fiber;
}
