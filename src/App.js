import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './component/Dashboard';
import Protected from "./Protected";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />

      </Routes>
    </Router>
  );
}

export default App;
