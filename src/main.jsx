import React from 'react'
import ReactDOM from 'react-dom/client'
import MainApp from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <UserProvider>
        <MainApp/>
      </UserProvider>
  </React.StrictMode>,
)
