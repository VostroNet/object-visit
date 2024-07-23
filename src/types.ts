import { OKind } from ".";



export type OBJVisitor = EnterLeaveVisitor | KindVisitor;

export type KindVisitor = {
  readonly [NodeT in OKind]?: OBJVisitFn | EnterLeaveVisitor;
};

export interface EnterLeaveVisitor {
  readonly enter?: OBJVisitFn;
  readonly leave?: OBJVisitFn;
}

/**
 * A visitor is comprised of visit functions, which are called on each node
 * during the visitor's traversal.
 */
export type OBJVisitFn = (
  /** The current node being visiting. */
  node: any,
  /** The index or key to this node from the parent node or Array. */
  key: string | number | undefined,
  /** The parent immediately above this node, which may be an Array. */
  parent: any | ReadonlyArray<any> | undefined,
  /** The key path to get to this node from the root node. */
  path: ReadonlyArray<string | number>,
  /**
   * All nodes and Arrays visited before reaching parent of this node.
   * These correspond to array indices in `path`.
   * Note: ancestors includes arrays which contain the parent of visited node.
   */
  ancestors: ReadonlyArray<any | ReadonlyArray<any>>
) => any;

/**
 * A reducer is comprised of reducer functions which convert OBJ nodes into
 * another form.
 */
export type OBJReducer = {
  readonly [NodeT in OKind]?: {
    readonly enter?: OBJVisitFn;
    readonly leave: OBJReducerFn;
  };
};

export type OBJReducerFn = (
  /** The current node being visiting. */
  node: any,
  /** The index or key to this node from the parent node or Array. */
  key: string | number | undefined,
  /** The parent immediately above this node, which may be an Array. */
  parent: any | ReadonlyArray<any> | undefined,
  /** The key path to get to this node from the root node. */
  path: ReadonlyArray<string | number>,
  /**
   * All nodes and Arrays visited before reaching parent of this node.
   * These correspond to array indices in `path`.
   * Note: ancestors includes arrays which contain the parent of visited node.
   */
  ancestors: ReadonlyArray<any | ReadonlyArray<any>>
) => any;

// Async
export type OBJVisitorAsync = EnterLeaveVisitorAsync | KindVisitorAsync | EnterLeaveVisitor | KindVisitor;

export type KindVisitorAsync = {
  readonly [NodeT in OKind]?: OBJVisitFnAsync | EnterLeaveVisitorAsync | OBJVisitFn | EnterLeaveVisitor;
};

export interface EnterLeaveVisitorAsync {
  readonly enter?: OBJVisitFnAsync | OBJVisitFn;
  readonly leave?: OBJVisitFnAsync | OBJVisitFn;
}

/**
 * A visitor is comprised of visit functions, which are called on each node
 * during the visitor's traversal.
 */
export type OBJVisitFnAsync = (
  /** The current node being visiting. */
  node: any,
  /** The index or key to this node from the parent node or Array. */
  key: string | number | undefined,
  /** The parent immediately above this node, which may be an Array. */
  parent: any | ReadonlyArray<any> | undefined,
  /** The key path to get to this node from the root node. */
  path: ReadonlyArray<string | number>,
  /**
   * All nodes and Arrays visited before reaching parent of this node.
   * These correspond to array indices in `path`.
   * Note: ancestors includes arrays which contain the parent of visited node.
   */
  ancestors: ReadonlyArray<any | ReadonlyArray<any>>
) => Promise<any>;

/**
 * A reducer is comprised of reducer functions which convert OBJ nodes into
 * another form.
 */
export type OBJReducerAsync = {
  readonly [NodeT in OKind]?: {
    readonly enter?: OBJVisitFnAsync | OBJVisitFn;
    readonly leave: OBJReducerFnAsync | OBJReducerFn;
  };
};

export type OBJReducerFnAsync = (
  /** The current node being visiting. */
  node: any,
  /** The index or key to this node from the parent node or Array. */
  key: string | number | undefined,
  /** The parent immediately above this node, which may be an Array. */
  parent: any | ReadonlyArray<any> | undefined,
  /** The key path to get to this node from the root node. */
  path: ReadonlyArray<string | number>,
  /**
   * All nodes and Arrays visited before reaching parent of this node.
   * These correspond to array indices in `path`.
   * Note: ancestors includes arrays which contain the parent of visited node.
   */
  ancestors: ReadonlyArray<any | ReadonlyArray<any>>
) => Promise<any>;
