export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type Element = any;

export interface ReactElementType {
	$$typeof: symbol | number;
	type;
	key: Key | null;
	ref: Ref | null;
	props: Props;
	__mark: string;
}

export type Action<State> = State | ((prevState: State) => State);
