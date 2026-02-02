import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import { AppTheme } from "./context/ThemeContext";
import { AuthLoading } from "./components/AuthLoading";
createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <AuthLoading>
        <BrowserRouter>
          <AppTheme>
              <App />
          </AppTheme>
        </BrowserRouter>
      </AuthLoading>
    </AuthProvider>
)