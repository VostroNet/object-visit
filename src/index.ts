import objectVisitSync from "./sync";
import objectVisitAsync from "./async";
import { isObject as isOBj } from "./utils";
export enum OKind {
  ARRAY = "array",
  FIELD = "field",
  OBJECT = "object",
}
  
export const BREAK: unknown = Object.freeze({});
export const SKIP: unknown = void 1;
export const isObject = isOBj;

export const objVisit = objectVisitSync;
export const objVisitSync = objectVisitSync;
export const objVisitAsync = objectVisitAsync;



export default objectVisitAsync;
