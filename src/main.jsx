// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// First Correction
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'   // ✅ Added import
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     {/* ✅ Wrapped App with BrowserRouter and set basename */}
//     <BrowserRouter basename="/ApiDevelopment_Server">
//       <App />
//     </BrowserRouter>
//   </StrictMode>,
// )

// 2nd

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
