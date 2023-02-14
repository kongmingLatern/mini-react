import { commitMutationEffects } from './commitWork';
import { MutationMask, NoFlags } from './fiberFlags';
import { FiberNode, FiberRootNode, createWorkInProcess } from './fiber';
import { completeWork } from './completeWork';
import { beginWork } from './beginWork';
import { HostRoot } from './workTag';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProcess(root.current, {});
}
function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop 发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);

	const finishWork = root.current.alternate;
	root.finishWorked = finishWork;

	// wip fiberNode 树 树中的flags
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishWorked = root.finishWorked;
	if (finishWorked === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commit 阶段开始', finishWorked);
	}
	// 重置
	root.finishWorked = null;

	// 判断是否存在 3 个子阶段需要执行的操作
	const subtreeHasEffect =
		(finishWorked.subtreeFlags & MutationMask) !== NoFlags;

	const rootHasEffect = (finishWorked.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation Placement
		commitMutationEffects(finishWorked);
		root.current = finishWorked;
		// layout
	} else {
		root.current = finishWorked;
	}
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}
function workLoop() {
	while (workInProgress !== null) {
		perforUnitOfWork(workInProgress);
	}
}
function perforUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizeProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
