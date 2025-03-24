import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './pages/Homepage.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage.jsx'
import NotePage from './pages/NotePage.jsx'
import LoginPage from './pages/Login.jsx'
import CreateAccountPage from './pages/CreateAccount.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/Login',
    element: <LoginPage />,
    
  },
  {
    path: '/Note',
    element: <NotePage />,
  },
  {
    path: '/create-account',
    element: <CreateAccountPage />,
  }
  
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
