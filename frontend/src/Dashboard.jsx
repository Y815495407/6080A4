import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Dashboard.css';

Modal.setAppElement('#root');

function Dashboard({ slides, setSlides }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slidesName, setSlidesName] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const token = localStorage.getItem('token'); 

  const fetchSlides = async () => {
    try {
      const response = await fetch('http://localhost:5005/store', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Access denied. Please check your token.');
      }
      const data = await response.json();
      setSlides(data.store.slides || []);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    }
  };

  const saveSlides = async (newSlides) => {
    try {
      const response = await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ store: { slides: newSlides } }),
      });

      if (!response.ok) {
        throw new Error('Access denied. Please check your token.');
      }
    } catch (error) {
      console.error('Failed to save slides:', error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSlidesName('');
  };

  const createSlides = () => {
    if (slidesName.trim()) {
      const newSlide = { 
        name: slidesName, 
        slides: [{ content: "Empty Slide" }],
        thumbnail: "", 
        description: "This is a new slide",
      };
      const updatedSlides = [...slides, newSlide];
      setSlides(updatedSlides);
      saveSlides(updatedSlides);
      closeModal();
    } else {
      alert('Please enter a slide name');
    }
  };

  const handleSlideClick = (index) => {
    navigate(`/edit-slide/${index}`);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    closeLogoutModal();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={openModal} className="new-slides-button">New slide</button>
      <button onClick={openLogoutModal} className="logout-button">Logout</button>

      <div className="slides-list">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="slides-item"
            onClick={() => handleSlideClick(index)}
          >
            <div className="thumbnail">
              {slide.thumbnail ? (
                <img src={slide.thumbnail} alt="Thumbnail" />
              ) : (
                <div className="placeholder"></div>
              )}
            </div>
            
            <h3>{slide.name}</h3>
            <p>{slide.description}</p>
            <span>{slide.slides.length} slides</span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="New slide"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Create New slide</h2>
        <input
          type="text"
          placeholder="Slide Name"
          value={slidesName}
          onChange={(e) => setSlidesName(e.target.value)}
          required
        />
        <button onClick={createSlides} className="create-button">Create</button>
        <button onClick={closeModal} className="cancel-button">Cancel</button>
      </Modal>

      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={closeLogoutModal}
        contentLabel="Confirm Logout"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Are you sure you want to logout?</h2>
        <button onClick={handleLogout} className="confirm-button">Yes, Logout</button>
        <button onClick={closeLogoutModal} className="cancel-button">Cancel</button>
      </Modal>
    </div>
  );
}

export default Dashboard;
