import React from 'react';
import './FontSelector.css';

function FontSelector({ selectedFont, onFontChange }) {
    return (
        <div className="font-selector">
            <label htmlFor="fontSelect">Choose Font:</label>
            <select
                id="fontSelect"
                value={selectedFont}
                onChange={(e) => onFontChange(e.target.value)}
            >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Times New Roman">Times New Roman</option>
            </select>
        </div>
    );
}

export default FontSelector;
