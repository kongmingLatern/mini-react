import { ReactElementType } from './../../shared/ReactTypes';
import { Props, Key, Ref } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'react-dom/src/hostConfig';
import { FunctionComponent, HostComponent, WorkTag } from './workTag';
export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	pendingProps: Props;
	memoizedProps: Props;
	memoizedState: any;
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
	deletions: FiberNode[] | null;
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
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		this.ref = null;

		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
		this.deletions = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
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
		wip.deletions = null;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
};

export function createFiberFromElement(element: ReactElementType) {
	const { type, key, props } = element;
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
