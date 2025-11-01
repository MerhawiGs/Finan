import './index.css'
import App from './App.tsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';   // Theme
import 'primereact/resources/primereact.min.css';                 // Core CSS
import 'primeicons/primeicons.css';

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CardProvider } from './contexts/CardContext';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <CardProvider>
      <App />
    </CardProvider>
  </BrowserRouter>
);
