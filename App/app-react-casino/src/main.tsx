import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([{
  path: '/',
  element: <Pagina Principal/>,
  errorElement: <Error />,
},
{
  path: '/login',
  element: <Login/>,
}
]);
<RouterProvider router={router} />

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
  </React.StrictMode>,
)

