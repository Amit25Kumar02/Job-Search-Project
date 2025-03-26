import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './store/authcontex.jsx'
import { FevriotProvider } from './store/fevriot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      {/* <FevriotProvider> */}
      <App />
      {/* </FevriotProvider> */}
    </AuthContextProvider>
  </StrictMode>,
)
