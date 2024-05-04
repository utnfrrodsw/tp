import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
//import { Principal } from './components/Principal/Principal.tsx'
//import { Header } from './components/Header/Header.tsx'
//import { Footer } from './components/Footer/Footer.tsx'
//
//import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/*
const router = createBrowserRouter([{
  path: '/',
  element: <Principal/>,
  //errorElement: <Error />,
},
//{
//  path: '/login',
//  element: <Login/>,
//}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </>
  </React.StrictMode>,
)
*/

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)