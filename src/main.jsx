import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { BudgetProvider } from './contexts/BudgetContext'
import { CompanyProvider } from './contexts/CompanyContext'
import { BudgetSettingsProvider } from './contexts/BudgetSettingsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BudgetProvider>
          <CompanyProvider>
            <BudgetSettingsProvider>
              <App />
            </BudgetSettingsProvider>
          </CompanyProvider>
        </BudgetProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)

