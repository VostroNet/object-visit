import { OKind } from ".";


export function cloneObject(node: any) {
    const descriptors = Object.getOwnPropertyDescriptors(node);
    Object.keys(descriptors).forEach((key: string) => {
      const descriptor = descriptors[key];
      if (!descriptor.writable) {
        descriptors[key].writable = true;
      }
      if (!descriptor.configurable) {
        descriptors[key].configurable = true;
      }
    });
    return Object.defineProperties({}, descriptors);
  }
  
  
  /**
   * Given a visitor instance and a node kind, return EnterLeaveVisitor for that kind.
   */
  export function getEnterLeaveForKind(
    visitor: any,
    kind: OKind
  ): any {
    const kindVisitor = (
      visitor as any
    )[kind];
  
    if (typeof kindVisitor === "object") {
      // { Kind: { enter() {}, leave() {} } }
      return kindVisitor;
    } else if (typeof kindVisitor === "function") {
      // { Kind() {} }
      return { enter: kindVisitor, leave: undefined };
    }
  
    // { enter() {}, leave() {} }
    return { enter: (visitor as any).enter, leave: (visitor as any).leave };
  }
  
  export function isObject(val: any) {
    if (val === null) {
      return false;
    }
    return typeof val === "object";
  }