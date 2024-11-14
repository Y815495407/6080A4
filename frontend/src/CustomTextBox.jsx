// CustomTextBox.jsx
import React, { useState } from 'react';
import './CustomTextBox.css';
import ToolBar from './ToolBar';

function CustomTextBox({ id, content, position = { top: '10px', left: '10px' }, size = { width: 20, height: 10 }, color = '#000000', fontSize = 1, onContentChange, onUpdateThumbnail }) {
  const [text, setText] = useState(content);
  const [showSettings, setShowSettings] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentSize, setCurrentSize] = useState(size);

  // 更新文本框内容并触发缩略图和后端保存
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
    saveToBackend(updatedData); // 实时保存到后端
    onUpdateThumbnail(); // 更新缩略图
  };

  // 保存数据到后端
  const saveToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ store: data }), // 将数据包装在 store 字段中
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // 双击显示设置框
  const handleDoubleClick = () => {
    setShowSettings(true);
  };

  // 处理属性更新
  const handleAttributeChange = (attribute, value) => {
    if (attribute === 'fontSize') {
      setCurrentFontSize(value);
    } else if (attribute === 'color') {
      setCurrentColor(value);
    } else if (attribute === 'size') {
      setCurrentSize(value);
    }
    updateBox(); // 每次属性更新后立即保存
  };

  // 应用设置并关闭
  const handleApplySettings = () => {
    setShowSettings(false);
    updateBox(); // 在关闭时保存设置
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
          border: '1px solid #ccc',
          padding: '5px',
          background: 'white',
          overflow: 'hidden',
        }}
        onDoubleClick={handleDoubleClick} // 双击显示设置框
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={updateBox} // 在失去焦点时保存更新
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: `${currentFontSize}em`,
            color: currentColor,
          }}
        />
      </div>

      {/* 弹出ToolBar设置框 */}
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
