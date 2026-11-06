import { jsx as reactJsx, jsxs as reactJsxs, Fragment } from "react/jsx-runtime"
import { guideProps } from "./translate"
export { Fragment }
export type { JSX } from "react/jsx-runtime"
export const jsx: typeof reactJsx = (type, props, key) =>
  reactJsx(type, guideProps(type, props), key)
export const jsxs: typeof reactJsxs = (type, props, key) =>
  reactJsxs(type, guideProps(type, props), key)
