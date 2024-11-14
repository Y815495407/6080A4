import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import './CustomImageBox.css';

function CustomImageBox({ id, imageUrl, position, size, alt, onContentChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const dragTimeoutRef = useRef(null);

    // Start the long-press timer
    const handleMouseDown = () => {
        dragTimeoutRef.current = setTimeout(() => {
            setIsDragging(true);
        }, 300); // Adjust the duration (in ms) for the long press
    };

    // Clear the timer if the mouse is released early
    const handleMouseUp = () => {
        clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = null;
        setIsDragging(false); // Stop dragging if the long-press is not completed
    };

    // Double-click to toggle editing mode
    const handleDoubleClick = () => {
        setIsEditing(!isEditing);
        setIsDragging(false); // Disable dragging when editing
    };

    // Save the new position when dragging stops
    const handleStop = (e, data) => {
        onContentChange(id, { top: `${data.y}px`, left: `${data.x}px` }, size, imageUrl, alt);
        setIsDragging(false);
    };

    return (
        <Draggable
            bounds="parent"
            disabled={!isDragging} // Only allow dragging if isDragging is true
            defaultPosition={{
                x: parseFloat(position.left),
                y: parseFloat(position.top),
            }}
            onStop={handleStop}
        >
            <div
                className="custom-image-box"
                style={{
                    width: `${size.width}%`,
                    height: `${size.height}%`,
                    position: 'relative',
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: isDragging ? 'move' : 'pointer',
                }}
                onMouseDown={handleMouseDown} // Start the long-press timer
                onMouseUp={handleMouseUp}     // Clear the timer on mouse release
                onMouseLeave={handleMouseUp}   // Clear the timer if the mouse leaves the box
                onDoubleClick={handleDoubleClick} // Toggle editing on double-click
            >
                {!imageUrl && <p>{alt}</p>}
                {isEditing && (
                    <div className="image-settings">
                        <h4>Edit Image Properties</h4>
                        <label>
                            Width (%):
                            <input
                                type="number"
                                value={size.width}
                                onChange={(e) =>
                                    onContentChange(id, position, { ...size, width: parseInt(e.target.value) }, imageUrl, alt)
                                }
                            />
                        </label>
                        <label>
                            Height (%):
                            <input
                                type="number"
                                value={size.height}
                                onChange={(e) =>
                                    onContentChange(id, position, { ...size, height: parseInt(e.target.value) }, imageUrl, alt)
                                }
                            />
                        </label>
                        <label>
                            Alt Text:
                            <input
                                type="text"
                                value={alt}
                                onChange={(e) => onContentChange(id, position, size, imageUrl, e.target.value)}
                            />
                        </label>
                        <button onClick={() => setIsEditing(false)}>Done</button>
                    </div>
                )}
            </div>
        </Draggable>
    );
}

export default CustomImageBox;
