// src/main.jsx
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthContextProvider } from './store/authcontex.jsx'
import { FevriotProvider } from './store/fevriot.jsx'

// const GOOGLE_CLIENT_ID = ;

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <FevriotProvider>
          <App />
        </FevriotProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
