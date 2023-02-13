import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTag';
import {
	createUpdateQueue,
	createUpdate,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { ReactElementType } from '../../shared/ReactTypes';

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	return element;
}
