import { Props, Key, Ref } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { WorkTag } from './workTag';
export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	pendingProps: Props;
	memoizeProps: Props;
	type: any;
	ref: Ref;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	alternate: FiberNode | null;
	flags: Flags;
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

		this.ref = null;

		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
	}
}
