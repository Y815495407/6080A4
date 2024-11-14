
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './CustomVideoBox.css';

function CustomVideoBox({ id, videoUrl, videoFile, position, size, autoplay, onContentChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl);
    const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
    const [currentAutoplay, setCurrentAutoplay] = useState(autoplay);
    const [currentSize, setCurrentSize] = useState(size);

    useEffect(() => {
        setCurrentVideoUrl(videoUrl);
        setCurrentVideoFile(videoFile);
        setCurrentAutoplay(autoplay);
        setCurrentSize(size);
    }, [videoUrl, videoFile, autoplay, size]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onContentChange(id, {
            videoUrl: currentVideoUrl,
            videoFile: currentVideoFile,
            autoplay: currentAutoplay,
            size: currentSize,
        });
        setIsEditing(false);
    };

    const handleSizeChange = (e) => {
        const newSize = { ...currentSize, [e.target.name]: e.target.value };
        setCurrentSize(newSize);
    };

    const renderVideo = () => {
        if (currentVideoFile) {
            const videoSrc = URL.createObjectURL(currentVideoFile);
            return (
                <video
                    src={videoSrc}
                    width={`${currentSize.width}%`}
                    height={`${currentSize.height}%`}
                    controls
                    autoPlay={currentAutoplay}
                />
            );
        } else if (currentVideoUrl) {
            return (
                <iframe
                    src={currentVideoUrl}
                    width={`${currentSize.width}%`}
                    height={`${currentSize.height}%`}
                    title="Video"
                    allowFullScreen
                    allow={currentAutoplay ? "autoplay" : ""}
                />
            );
        }
        return null;
    };

    return (
        <Draggable
            bounds="parent"
            defaultPosition={{ x: parseFloat(position.left), y: parseFloat(position.top) }}
            onStop={(e, data) => {
                onContentChange(id, {
                    position: { top: `${data.y}px`, left: `${data.x}px` },
                });
            }}
        >
            <div className="custom-video-box" onDoubleClick={handleDoubleClick}>
                {renderVideo()}
                
                {isEditing && (
                    <div className="video-edit-modal">
                        <h3>Edit Video Settings</h3>
                        <label>
                            Video URL:
                            <input
                                type="text"
                                value={currentVideoUrl}
                                onChange={(e) => setCurrentVideoUrl(e.target.value)}
                                disabled={!!currentVideoFile}
                            />
                        </label>
                        <label>
                            Upload Video:
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setCurrentVideoFile(e.target.files[0])}
                                disabled={!!currentVideoUrl}
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
                        <label>
                            Autoplay:
                            <input
                                type="checkbox"
                                checked={currentAutoplay}
                                onChange={(e) => setCurrentAutoplay(e.target.checked)}
                            />
                        </label>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </Draggable>
    );
}

export default CustomVideoBox;
