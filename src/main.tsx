import React from "react"
import ReactDOM from "react-dom/client"
import RootRouter from "./RootRouter"
import "./index.css"
import "./i18n/i18n.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>,
)
