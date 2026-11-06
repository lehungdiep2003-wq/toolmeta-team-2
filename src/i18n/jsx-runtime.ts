import { jsx as reactJsx, jsxs as reactJsxs, Fragment } from "react/jsx-runtime"
import { translateDOMProps } from "./translate"
export { Fragment }
export type { JSX } from "react/jsx-runtime"
export const jsx: typeof reactJsx = (type, props, key) =>
  reactJsx(type, translateDOMProps(type, props), key)
export const jsxs: typeof reactJsxs = (type, props, key) =>
  reactJsxs(type, translateDOMProps(type, props), key)
