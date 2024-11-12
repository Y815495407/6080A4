import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSlides({ slides, setSlides }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const slide = slides[id];
  const token = localStorage.getItem('token'); 

  if (!slide) {
    return <div>Slide not found.</div>;
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure?")) {
      const updatedSlides = slides.filter((_, index) => index !== parseInt(id));
      setSlides(updatedSlides);

      try {
        const response = await fetch('http://localhost:5005/store', {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ store: { slides: updatedSlides } }),
        });

        if (response.ok) {
          navigate('/dashboard');
        } else {
          console.error("Failed to update slides:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating slides:", error);
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Edit Slide: {slide.name}</h1>
      <p>{slide.description}</p>

      <button onClick={handleBack}>Back to Dashboard</button>
      <button onClick={handleDelete}>Delete Slide</button>
    </div>
  );
}

export default EditSlides;
