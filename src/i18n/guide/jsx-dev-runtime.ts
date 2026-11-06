import { jsxDEV as reactJsxDEV, Fragment } from "react/jsx-dev-runtime"
import { guideProps } from "./translate"
export { Fragment }
export type { JSX } from "react/jsx-dev-runtime"
export const jsxDEV: typeof reactJsxDEV = (
  type,
  props,
  key,
  isStaticChildren,
  source,
  self,
) =>
  reactJsxDEV(
    type,
    guideProps(type, props),
    key,
    isStaticChildren,
    source,
    self,
  )
