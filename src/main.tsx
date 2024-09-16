import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TodoAppComponent } from './components/todo-app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoAppComponent />
  </StrictMode>,
)
