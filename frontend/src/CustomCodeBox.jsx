import React, { useState, useEffect } from 'react';
import './CustomCodeBox.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

function CustomCodeBox({ id, code, language, position, size, fontSize, onContentChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);
    const [currentLanguage, setCurrentLanguage] = useState(language || 'javascript');
    const [currentFontSize, setCurrentFontSize] = useState(fontSize || 1);
    const [currentSize, setCurrentSize] = useState(size);

    useEffect(() => {
        setCurrentCode(code);
        setCurrentLanguage(language);
        setCurrentFontSize(fontSize);
        setCurrentSize(size);
    }, [code, language, fontSize, size]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onContentChange(id, {
            code: currentCode,
            language: currentLanguage,
            fontSize: currentFontSize,
            size: currentSize,
        });
        setIsEditing(false);
    };

    const handleSizeChange = (e) => {
        const newSize = { ...currentSize, [e.target.name]: e.target.value };
        setCurrentSize(newSize);
    };

    const renderHighlightedCode = () => {
        return (
            <pre style={{ fontSize: `${currentFontSize}em` }}>
                <code
                    className={`language-${currentLanguage}`}
                    dangerouslySetInnerHTML={{
                        __html: hljs.highlight(currentLanguage, currentCode).value,
                    }}
                />
            </pre>
        );
    };

    return (
        <div
            className="custom-code-box"
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
            }}
            onDoubleClick={handleDoubleClick}
        >
            {renderHighlightedCode()}

            {isEditing && (
                <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setIsEditing(false)}>&times;</button>
                        <h3>Edit Code Block Settings</h3>
                        <label>
                            Language:
                            <select
                                value={currentLanguage}
                                onChange={(e) => setCurrentLanguage(e.target.value)}
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="c">C</option>
                            </select>
                        </label>
                        <label>
                            Code:
                            <textarea
                                rows="8"
                                value={currentCode}
                                onChange={(e) => setCurrentCode(e.target.value)}
                                style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}
                            />
                        </label>
                        <label>
                            Font Size (em):
                            <input
                                type="number"
                                value={currentFontSize}
                                onChange={(e) => setCurrentFontSize(parseFloat(e.target.value) || 1)}
                            />
                        </label>
                        <label>
                            Width (%):
                            <input
                                type="number"
                                name="width"
                                value={currentSize.width}
                                onChange={handleSizeChange}
                            />
                        </label>
                        <label>
                            Height (%):
                            <input
                                type="number"
                                name="height"
                                value={currentSize.height}
                                onChange={handleSizeChange}
                            />
                        </label>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomCodeBox;
