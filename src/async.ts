

// ---

import { BREAK, OKind } from ".";
import { EnterLeaveVisitorAsync, OBJReducerAsync, OBJVisitorAsync } from "./types";
import { cloneObject, getEnterLeaveForKind, isObject } from "./utils";



export default async function objVisitAsync(root: any, visitor: OBJVisitorAsync | OBJReducerAsync) {
  const enterLeaveMap = new Map<OKind, EnterLeaveVisitorAsync>();
  for (const kind of Object.values(OKind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }

  let stack: any = undefined;
  let inArray = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node: any = undefined;
  let key = undefined;
  let parent = undefined;
  const path: string[] = [];
  const ancestors: any[] = [];
  let newRoot = root;

  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();

      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;

          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;

            if (editValue === undefined) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = cloneObject(node);
          for (const [editKey, editValue] of edits) {
            if (editValue !== undefined) {
              node[editKey] = editValue;
            } else {
              delete node[editKey];
            }
          }
        }
      }

      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? (inArray ? index : keys[index]) : undefined;
      node = parent ? parent[key] : newRoot;

      if (node === null || node === undefined) {
        continue;
      }

      if (parent) {
        path.push(key);
      }
    }
    let result = node;
    // if (!Array.isArray(node)) {
    // devAssert(isNode(node), `Invalid AST Node: ${inspect(node)}.`);
    let kind = Array.isArray(node)
      ? OKind.ARRAY
      : isObject(node)
      ? OKind.OBJECT
      : OKind.FIELD;
    const visitFn = isLeaving
      ? enterLeaveMap.get(kind)?.leave
      : enterLeaveMap.get(kind)?.enter;

    if (visitFn) {
      result = await visitFn.call(visitor, node, key, parent, path, ancestors);
    }
    if (result === BREAK) {
      break;
    }

    edits.push([key, result]);
    if (result === undefined) {
      path.pop();
      continue;
    }
    if (!isLeaving) {
      node = result;
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (isLeaving) {
      path.pop();
    } else {
      stack = { inArray, index, keys, edits, prev: stack };
      inArray = Array.isArray(node);
      keys = inArray ? node : isObject(node) ? Object.keys(node) : [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }

  return newRoot;
}
