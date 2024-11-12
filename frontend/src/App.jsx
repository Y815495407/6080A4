import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.jsx';
import EditSlides from './EditSlides.jsx';

function App() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }

      try {
        const response = await fetch('http://localhost:5005/store', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSlides(data.slides || []); 
        } else {
          console.error("Failed to fetch slides:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard slides={slides} setSlides={setSlides} />} />
        <Route path="/edit-slide/:id" element={<EditSlides slides={slides} setSlides={setSlides} />} />
      </Routes>
    </Router>
  );
}

export default App;

