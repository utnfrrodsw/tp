import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './pages/App/App'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryCacheSync from './lib/QueryCacheSync'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
       <QueryCacheSync />
      {/* ThemeProvider prende/apaga la clase "dark" en el <html> (modo oscuro) */}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
