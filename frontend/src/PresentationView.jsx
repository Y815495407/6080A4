import React from 'react';
import { useParams } from 'react-router-dom';

function PresentationView({ presentations }) {
  const { id } = useParams();
  const presentation = presentations.find((pres, index) => index === parseInt(id));

  if (!presentation) {
    return <div>Presentation not found.</div>;
  }

  return (
    <div>
      <h1>{presentation.name}</h1>
      <div>
        {presentation.slides.map((slide, idx) => (
          <div key={idx}>
            <h3>Slide {idx + 1}</h3>
            <p>{slide.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PresentationView;
