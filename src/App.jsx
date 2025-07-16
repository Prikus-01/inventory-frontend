import { Outlet } from "react-router"
import Header from "./Components/header.jsx"

function App() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
