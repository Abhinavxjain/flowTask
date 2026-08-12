import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>FlowTask — Coming Soon</h1>} />
          {/* Login/Register/Dashboard routes will be added Day 8-9 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;