import {
	ChildDeletion,
	MutationMask,
	NoFlags,
	Placement,
	Update
} from './fiberFlags';
import { FiberNode, FiberRootNode } from './fiber';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTag';
import {
	appendChildToContainer,
	commitUpdate,
	Container,
	removeChild
} from 'hostConfig';
let nextEffect: FiberNode | null = null;
export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;
	while (nextEffect) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;

		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			// 向上遍历 DFS
			up: while (nextEffect) {
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;

				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}

				nextEffect = nextEffect.return;
			}
		}
	}
};

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
	const flags = finishedWork.flags;
	// Implement
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
	// flags Update
	if ((flags & Update) !== NoFlags) {
		commitUpdate(finishedWork);
		finishedWork.flags &= ~Update;
	}
	// flags ChildDeletion
	if ((flags & ChildDeletion) !== NoFlags) {
		const deletions = finishedWork.deletions;
		if (deletions) {
			deletions.forEach((chidToDelete) => {
				commitDeletion(chidToDelete);
			});
		}
		commitUpdate(finishedWork);
		finishedWork.flags &= ~ChildDeletion;
	}
}

function commitDeletion(childToDelete: FiberNode) {
	let rootHostComponent: FiberNode | null = null;
	// 递归子树
	commitNestedComponent(childToDelete, (unmountFiber) => {
		switch (unmountFiber.tag) {
			case HostComponent:
				if (rootHostComponent === null) {
					rootHostComponent = unmountFiber;
				}
				// TODO: 解绑 ref
				break;

			case HostText:
				if (rootHostComponent === null) {
					rootHostComponent = unmountFiber;
				}
				return;

			case FunctionComponent:
				// TODO: useEffect unmount
				return;

			default:
				if (__DEV__) {
					console.warn('未处理的 commitDeletion');
				}
				break;
		}
	});
	if (rootHostComponent) {
		const hostParent = getHostParent(childToDelete);
		removeChild(
			(rootHostComponent as FiberNode).stateNode,
			hostParent as Element
		);
		childToDelete.return = null;
		childToDelete.child = null;
	}
}

function commitNestedComponent(
	root: FiberNode,
	onCommitUnmount: (fiber: FiberNode) => void
) {
	let node = root;
	while (true) {
		onCommitUnmount(node);
		if (node.child) {
			// 向下遍历
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === root) {
			// 终止条件
			return;
		}
		while (node.sibling === null) {
			if (node.return === null || node.return === root) {
				return;
			}
			// 向上归
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function commitPlacement(finishedWork: FiberNode) {
	if (__DEV__) {
		console.warn('执行 Placement 操作', finishedWork);

		// parent DOM
		const hostParent = getHostParent(finishedWork);
		// finishedWork ~~ DOM append parent DOM
		if (hostParent) {
			appendPlacementNodeIntoContainer(finishedWork, hostParent);
		}
	}
}

function getHostParent(fiber: FiberNode): Container | null {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未处理的 getHostParent');
	}
	return null;
}
function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
