import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatch, Dispatcher } from '../../react/src/currentDispatcher';
import {
	createUpdate,
	createUpdateQueue,
	UpdateQueue,
	enqueueUpdate,
	processUpdateQueue
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	wip.memoizedState = null;

	const current = wip.alternate;

	if (current) {
		// update
		currentDispatcher.current = HooksDispatcherOnUpdate;
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;

	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};
const HooksDispatcherOnUpdate: Dispatcher = {
	useState: updateState
};

function updateState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前 useState 对应的 hook 数据
	const hook = updateWorkInProgressHook();

	const queue = hook.updateQueue as UpdateQueue<State>;
	const pending = queue.shared.pending;

	if (pending) {
		const { memoizedState } = processUpdateQueue(hook.memoizedState, pending);
		hook.memoizedState = memoizedState;
	}

	return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function updateWorkInProgressHook(): Hook {
	// TODO: render
	let nextCurrentHook: Hook | null = null;
	if (currentHook === null) {
		const current = currentlyRenderingFiber?.alternate;
		if (current) {
			nextCurrentHook = current?.memoizedState;
		} else {
			nextCurrentHook = null;
		}
	} else {
		// FC update 后续的 hook
		nextCurrentHook = currentHook.next;
	}

	if (nextCurrentHook === null) {
		// 说明当前的 hook 已经用完了
		throw new Error('Rendered more hooks than during the previous render');
	}

	currentHook = nextCurrentHook as Hook;
	const newHook: Hook = {
		memoizedState: currentHook.memoizedState,
		updateQueue: currentHook.updateQueue,
		next: null
	};
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('Rendered more hooks than during the previous render');
		} else {
			workInProgressHook = newHook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		workInProgressHook.next = newHook;
		workInProgressHook = newHook;
	}
	return workInProgressHook;
}

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前 useState 对应的 hook 数据
	const hook = mountWorkInProgressHook();

	let memoizedState;
	if (initialState instanceof Function) {
		initialState = initialState();
	} else {
		memoizedState = initialState;
	}

	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;

	return [memoizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	UpdateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);

	enqueueUpdate(UpdateQueue, update);

	scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};

	if (workInProgressHook === null) {
		// mount 时第一个 hook
		if (currentlyRenderingFiber === null) {
			throw new Error('Rendered more hooks than during the previous render');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		// mount 时后续 hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
