// ToolBar.jsx
import React from 'react';
import './ToolBar.css';

function ToolBar({ selectedTextBox, onAttributeChange, onClose }) {
    const { fontSize = 1, color = '#000000', size = { width: 20, height: 10 } } = selectedTextBox;

    return (
        <div className="toolbar-modal-overlay" onClick={onClose}>
            <div className="toolbar-modal" onClick={(e) => e.stopPropagation()}>
                <div className="toolbar-item">
                    <label>Font Size:</label>
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => onAttributeChange('fontSize', parseFloat(e.target.value) || 1)}
                    />
                </div>
                <div className="toolbar-item">
                    <label>Color:</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onAttributeChange('color', e.target.value)}
                    />
                </div>
                <div className="toolbar-item">
                    <label>Width (%):</label>
                    <input
                        type="number"
                        value={size.width}
                        onChange={(e) => {
                            const width = parseFloat(e.target.value) || 0;
                            onAttributeChange('size', { ...size, width });
                        }}
                    />
                </div>
                <div className="toolbar-item">
                    <label>Height (%):</label>
                    <input
                        type="number"
                        value={size.height}
                        onChange={(e) => {
                            const height = parseFloat(e.target.value) || 0;
                            onAttributeChange('size', { ...size, height });
                        }}
                    />
                </div>
                <button onClick={onClose} className="close-toolbar-button">Apply</button>
            </div>
        </div>
    );
}

export default ToolBar;
