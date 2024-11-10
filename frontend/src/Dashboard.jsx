import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Dashboard.css';

Modal.setAppElement('#root');

function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slidesName, setslidesName] = useState('');
  const [slidess, setslidess] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const savedslidess = JSON.parse(localStorage.getItem('slidess'));
    if (savedslidess) {
      setslidess(savedslidess);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('slidess', JSON.stringify(slidess));
  }, [slidess]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setslidesName('');
  };

  const createslides = () => {
    if (slidesName.trim()) {
      const newslides = { 
        name: slidesName, 
        slides: [{ content: "Empty Slide" }],
        thumbnail: "", 
        description: "This is a new slides",
      };
      setslidess([...slidess, newslides]);
      closeModal();
    } else {
      alert('Please enter a slides name');
    }
  };

  const handleslidesClick = (index) => {
    navigate(`/slides/${index}`);
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
      <button onClick={openModal} className="new-slides-button">New slides</button>
      <button onClick={openLogoutModal} className="logout-button">Logout</button>

      <div className="slides-list">
        {slidess.map((slides, index) => (
          <div 
            key={index} 
            className="slides-item"
            onClick={() => handleslidesClick(index)}
          >
            <div className="thumbnail">
              {slides.thumbnail ? (
                <img src={slides.thumbnail} alt="Thumbnail" />
              ) : (
                <div className="placeholder"></div>
              )}
            </div>
            <h3>{slides.name}</h3>
            <p>{slides.description}</p>
            <span>{slides.slides.length} slides</span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="New slides"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Create New slides</h2>
        <input
          type="text"
          placeholder="slides Name"
          value={slidesName}
          onChange={(e) => setslidesName(e.target.value)}
          required
        />
        <br></br>
        <button onClick={createslides} className="create-button">Create</button>
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
