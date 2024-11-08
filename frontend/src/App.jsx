// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home.jsx'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />          {/* 欢迎页面路由 */}
      </Routes>
    </Router>
  );
}

export default App;
