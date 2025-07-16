import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Components/home.jsx'
import Transaction from "./Components/transaction.jsx";
import Products from "./Components/products.jsx";
import Godowns from "./Components/godowns.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, Component: Home },
      { path: "transactions", Component: Transaction },
      { path: "products", Component: Products },
      { path: "godowns", Component: Godowns },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
