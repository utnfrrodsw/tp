import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './routes/Login.tsx'
import Register from './routes/Register.tsx'
import Dashboard from './routes/Dashboard.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RutasProtegidas from './routes/RutasProtegidas.tsx'
import { AuthProvider } from './auth/auhtProvider.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },

  {
    path: "/register",
    element: <Register />
  },

  {
    path: "/",
    element: <RutasProtegidas />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
