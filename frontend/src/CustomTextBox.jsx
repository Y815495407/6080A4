import React, { useState } from 'react';
import './CustomTextBox.css';
import ToolBar from './ToolBar';

function CustomTextBox({
  id,
  content,
  position = { top: '10px', left: '10px' },
  size = { width: 20, height: 10 },
  color = '#000000',
  fontSize = 1,
  fontFamily = 'Arial',
  onContentChange,
  onUpdateThumbnail
}) {
  const [text, setText] = useState(content);
  const [showSettings, setShowSettings] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentSize, setCurrentSize] = useState(size);
  let saveTimer;

  if (!onUpdateThumbnail) {
    throw new Error('onUpdateThumbnail 必须提供！');
  }

  const saveToBackend = async (updatedSlides) => {
    const token = localStorage.getItem('token');
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
        throw new Error('Failed to save data');
      }
      console.log('Slides saved successfully');
    } catch (error) {
      console.error('Error saving slides:', error);
    }
  };

  const updateBox = () => {
    const updatedData = {
      id,
      text,
      position,
      size: currentSize,
      color: currentColor,
      fontSize: currentFontSize,
    };
    onContentChange(id, text, position, currentSize, currentColor, currentFontSize);

    // 获取当前 slides 的深拷贝并更新
    const updatedSlides = JSON.parse(localStorage.getItem('slides')) || [];
    const slideIndex = updatedSlides.findIndex(slide => slide.id === id);
    if (slideIndex >= 0) {
      updatedSlides[slideIndex] = updatedData;
    } else {
      updatedSlides.push(updatedData);
    }
    saveToBackend(updatedSlides); // 保存到后端
    onUpdateThumbnail(); // 更新缩略图
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    onContentChange(id, e.target.value, position, currentSize, currentColor, currentFontSize);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      updateBox();
    }, 500);
  };

  const handleAttributeChange = (attribute, value) => {
    if (attribute === 'fontSize') {
      setCurrentFontSize(value);
    } else if (attribute === 'color') {
      setCurrentColor(value);
    } else if (attribute === 'size') {
      setCurrentSize(value);
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      updateBox();
    }, 500);
  };

  const handleApplySettings = () => {
    setShowSettings(false);
    updateBox();
  };

  return (
    <>
      <div
        className="custom-text-box"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: `${currentSize.width}%`,
          height: `${currentSize.height}%`,
          color: currentColor,
          fontSize: `${currentFontSize}em`,
          fontFamily: fontFamily,
          border: '1px solid #ccc',
          padding: '5px',
          background: 'white',
          overflow: 'hidden',
        }}
        onDoubleClick={() => setShowSettings(true)}
      >
        <textarea
          value={text}
          onChange={handleTextChange}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: `${currentFontSize}em`,
            color: currentColor,
            fontFamily: fontFamily,
          }}
        />
      </div>
      {showSettings && (
        <ToolBar
          selectedTextBox={{ fontSize: currentFontSize, color: currentColor, size: currentSize }}
          onAttributeChange={handleAttributeChange}
          onClose={handleApplySettings}
        />
      )}
    </>
  );
}

export default CustomTextBox;
