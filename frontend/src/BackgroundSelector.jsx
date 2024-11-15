import React, { useState } from 'react';

function BackgroundSelector({ onBackgroundChange }) {
  const [bgType, setBgType] = useState('color');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgGradient, setBgGradient] = useState('linear-gradient(to right, #6a11cb, #2575fc)');
  const [bgImage, setBgImage] = useState('');

  const handleApplyBackground = () => {
    let background;
    if (bgType === 'color') {
      background = bgColor;
    } else if (bgType === 'gradient') {
      background = bgGradient;
    } else if (bgType === 'image') {
      background = `url(${bgImage})`;
    }
    onBackgroundChange(background);
  };

  return (
    <div className="background-selector-modal">
      <h3>Select Background</h3>
      <label>
        <input
          type="radio"
          name="bgType"
          value="color"
          checked={bgType === 'color'}
          onChange={() => setBgType('color')}
        />
        Color
      </label>
      {bgType === 'color' && (
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      )}

      <label>
        <input
          type="radio"
          name="bgType"
          value="gradient"
          checked={bgType === 'gradient'}
          onChange={() => setBgType('gradient')}
        />
        Gradient
      </label>
      {bgType === 'gradient' && (
        <input
          type="text"
          placeholder="Enter gradient (e.g., linear-gradient(...))"
          value={bgGradient}
          onChange={(e) => setBgGradient(e.target.value)}
        />
      )}

      <label>
        <input
          type="radio"
          name="bgType"
          value="image"
          checked={bgType === 'image'}
          onChange={() => setBgType('image')}
        />
        Image
      </label>
      {bgType === 'image' && (
        <input
          type="text"
          placeholder="Enter image URL"
          value={bgImage}
          onChange={(e) => setBgImage(e.target.value)}
        />
      )}

      <button onClick={handleApplyBackground}>Apply Background</button>
    </div>
  );
}

export default BackgroundSelector;
