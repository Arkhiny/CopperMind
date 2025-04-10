// index.jsx (or wherever your root code is)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Homepage from './pages/Homepage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import NotePage from './pages/NotePage.jsx'
import LoginPage from './pages/Login.jsx'
import CreateAccountPage from './pages/CreateAccount.jsx'
import ProtectedRoute from './pages/ProtectedRoute.jsx';

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
    element: (
      <ProtectedRoute>
        {/* Pass the active user as a prop (retrieved from localStorage) to NotePage */}
        <NotePage activeUser={JSON.parse(localStorage.getItem("activeUser"))} />
      </ProtectedRoute>
    ),
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
