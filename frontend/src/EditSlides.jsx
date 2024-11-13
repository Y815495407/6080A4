import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditSlides.css';

function EditSlides({ slides, setSlides }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const slideDeck = slides[id];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(slideDeck?.name || '');
  const slideRefs = useRef([]);
  const token = localStorage.getItem('token'); 

  if (!slideDeck) {
    return <div>Slide not found.</div>;
  }

  const updateSlideContent = (index, content) => {
    const updatedSlides = [...slides];
    updatedSlides[id].slides[index].content = content;
    setSlides(updatedSlides);
    saveSlidesToBackend(updatedSlides); 
    setCurrentSlideIndex(index); 
  };

  const updateTitle = (newTitle) => {
    const updatedSlides = [...slides];
    updatedSlides[id].name = newTitle;
    setSlides(updatedSlides);
    saveSlidesToBackend(updatedSlides); 
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const addSlide = () => {
    const updatedSlides = [...slides];
    updatedSlides[id].slides.push({ content: '' });
    setSlides(updatedSlides);
    const newIndex = updatedSlides[id].slides.length - 1;
    setCurrentSlideIndex(newIndex);
    goToSlide(newIndex);
    saveSlidesToBackend(updatedSlides); 
  };

  const deleteSlide = () => {
    if (slideDeck.slides.length > 1) {
      const updatedSlides = [...slides];
      updatedSlides[id].slides.splice(currentSlideIndex, 1);
      setSlides(updatedSlides);
      const newIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : 0;
      setCurrentSlideIndex(newIndex);
      goToSlide(newIndex);
      saveSlidesToBackend(updatedSlides);
    }
  };

  const deleteSlideDeck = () => {
    if (window.confirm("Are you sure you want to delete the entire slide deck?")) {
      const updatedSlides = slides.filter((_, index) => index !== parseInt(id));
      setSlides(updatedSlides);
      saveSlidesToBackend(updatedSlides);
      navigate('/dashboard');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' && slideDeck.slides[currentSlideIndex].content === '') {
      deleteSlide();
    }
  };

  const saveSlidesToBackend = async (updatedSlides) => {
    try {
      const response = await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ store: { slides: updatedSlides } }),
      });
      if (!response.ok) {
        throw new Error('Failed to save slides');
      }
    } catch (error) {
      console.error('Error saving slides:', error);
    }
  };

  return (
    <div className="edit-slides-container">
      <div className="slide-thumbnails">
        <h2>Slides</h2>
        {slideDeck.slides.map((slide, index) => (
          <div
            key={index}
            className={`thumbnail-item ${index === currentSlideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <div className="thumbnail-preview">
              <div
                className="thumbnail-content"
                style={{ transform: 'scale(0.2)', transformOrigin: 'top left' }}
                dangerouslySetInnerHTML={{ __html: slide.content }}
              />
            </div>
          </div>
        ))}
        <button onClick={addSlide} className="add-slide-button">Add Slide</button>
      </div>

      <div className="slides-editor">
        <div className="title-container">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                updateTitle(title);
              }}
              autoFocus
              className="title-input"
            />
          ) : (
            <h1 onClick={() => setIsEditingTitle(true)} className="editable-title">
              {title} <button onClick={() => setIsEditingTitle(true)} className="edit-title-button">✏️</button>
            </h1>
          )}
        </div>
        <div className="slides-container">
          {slideDeck.slides.map((slide, index) => (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className={`slide-page ${index === currentSlideIndex ? 'active-slide' : ''}`}
            >
              <textarea
                value={slide.content}
                onChange={(e) => updateSlideContent(index, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter slide content here..."
                className="slide-textarea"
                autoFocus={index === currentSlideIndex}
              />
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">Back to Dashboard</button>
        <button onClick={deleteSlideDeck} className="delete-slide-deck-button">Delete Slide Deck</button>
      </div>
    </div>
  );
}

export default EditSlides;
