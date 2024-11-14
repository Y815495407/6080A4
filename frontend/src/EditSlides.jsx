import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomTextBox from './CustomTextBox';
import CustomImageBox from './CustomImageBox';
import CustomVideoBox from './CustomVideoBox';
import ToolBar from './ToolBar';
import './EditSlides.css';

function EditSlides({ slides, setSlides }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const slideDeck = slides[id];
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(slideDeck?.name || '');
    const [selectedTextBox, setSelectedTextBox] = useState(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
    const nextTextBoxId = useRef(1);
    const nextImageBoxId = useRef(1);
    const nextVideoBoxId = useRef(1); 
    const token = localStorage.getItem('token');
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [videoSourceType, setVideoSourceType] = useState('url');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [autoplay, setAutoplay] = useState(false);

    const initializeTextBoxes = () => slideDeck.slides.map(() => []);
    const initializeImageBoxes = () => slideDeck.slides.map(() => []);
    const initializeVideoBoxes = () => slideDeck.slides.map(() => []);
    const [textBoxes, setTextBoxes] = useState(initializeTextBoxes);
    const [imageBoxes, setImageBoxes] = useState(initializeImageBoxes);
    const [videoBoxes, setVideoBoxes] = useState(initializeVideoBoxes);

    if (!slideDeck) {
        return <div>Slide not found.</div>;
    }

    const addTextBox = () => {
        const newTextBox = {
            id: nextTextBoxId.current++,
            content: '',
            position: { top: '10px', left: '10px' },
            size: { width: 50, height: 30 },
            fontSize: 1,
            color: '#000000',
        };
        setTextBoxes((prevTextBoxes) => {
            const updatedTextBoxes = [...prevTextBoxes];
            updatedTextBoxes[currentSlideIndex] = [...updatedTextBoxes[currentSlideIndex], newTextBox];
            return updatedTextBoxes;
        });
    };

    const handleImageUpload = (imageBoxId, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result;
            setImageBoxes((prevImageBoxes) => {
                const updatedImageBoxes = [...prevImageBoxes];
                updatedImageBoxes[currentSlideIndex] = updatedImageBoxes[currentSlideIndex].map((box) =>
                    box.id === imageBoxId ? { ...box, imageUrl: imageData } : box
                );
                return updatedImageBoxes;
            });
        };
        reader.readAsDataURL(file);
    };

    const addImageBox = () => {
        const newImageBox = {
            id: nextImageBoxId.current++,
            imageUrl: '',
            position: { top: '10px', left: '10px' },
            size: { width: 50, height: 50 },
            alt: 'New Image',
        };
        setImageBoxes((prevImageBoxes) => {
            const updatedImageBoxes = [...prevImageBoxes];
            updatedImageBoxes[currentSlideIndex] = [...updatedImageBoxes[currentSlideIndex], newImageBox];
            return updatedImageBoxes;
        });

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(newImageBox.id, file);
            }
        };
        fileInput.click();
    };

    const openVideoModal = () => {
        setVideoModalOpen(true);
    };

    const handleAddVideo = () => {
        const newVideoBox = {
            id: nextVideoBoxId.current++,
            videoUrl: videoSourceType === 'url' ? videoUrl : null,
            videoFile: videoSourceType === 'file' ? videoFile : null,
            autoplay,
            position: { top: '10px', left: '10px' },
            size: { width: 50, height: 30 },
        };
        setVideoBoxes((prevVideoBoxes) => {
            const updatedVideoBoxes = [...prevVideoBoxes];
            updatedVideoBoxes[currentSlideIndex] = [...updatedVideoBoxes[currentSlideIndex], newVideoBox];
            return updatedVideoBoxes;
        });
        setVideoModalOpen(false);
        setVideoUrl('');
        setVideoFile(null);
        setAutoplay(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoSourceType('file');
        }
    };

    const handleAttributeChange = (attribute, value) => {
        if (selectedTextBox) {
            setTextBoxes((prevTextBoxes) => {
                const updatedTextBoxes = [...prevTextBoxes];
                updatedTextBoxes[currentSlideIndex] = updatedTextBoxes[currentSlideIndex].map((box) =>
                    box.id === selectedTextBox.id ? { ...box, [attribute]: value } : box
                );
                return updatedTextBoxes;
            });
            setSelectedTextBox((prev) => ({ ...prev, [attribute]: value }));
        }
    };

    const handleTextBoxSelect = (id) => {
        const textBox = textBoxes[currentSlideIndex].find((box) => box.id === id);
        setSelectedTextBox(textBox);
        setIsToolbarVisible(true);
    };

    const handleCloseToolbar = () => {
        setIsToolbarVisible(false);
        setSelectedTextBox(null);
    };

    const updateTitle = (newTitle) => {
        const updatedSlides = [...slides];
        updatedSlides[id].name = newTitle;
        setSlides(updatedSlides);
        saveSlidesToBackend(updatedSlides);
    };

    const goToSlide = (index) => setCurrentSlideIndex(index);

    const goToNextSlide = () => {
        if (currentSlideIndex < slideDeck.slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    const addSlide = () => {
        const updatedSlides = [...slides];
        updatedSlides[id].slides.push({ content: '' });
        setSlides(updatedSlides);
        setTextBoxes([...textBoxes, []]);
        setImageBoxes([...imageBoxes, []]);
        setVideoBoxes([...videoBoxes, []]);
        setCurrentSlideIndex(updatedSlides[id].slides.length - 1);
        saveSlidesToBackend(updatedSlides);
    };

    const deleteSlide = () => {
        if (slideDeck.slides.length > 1) {
            const updatedSlides = [...slides];
            updatedSlides[id].slides.splice(currentSlideIndex, 1);
            const updatedTextBoxes = [...textBoxes];
            const updatedImageBoxes = [...imageBoxes];
            const updatedVideoBoxes = [...videoBoxes];
            updatedTextBoxes.splice(currentSlideIndex, 1);
            updatedImageBoxes.splice(currentSlideIndex, 1);
            updatedVideoBoxes.splice(currentSlideIndex, 1);
            setSlides(updatedSlides);
            setTextBoxes(updatedTextBoxes);
            setImageBoxes(updatedImageBoxes);
            setVideoBoxes(updatedVideoBoxes);
            setCurrentSlideIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
            saveSlidesToBackend(updatedSlides);
        } else {
            alert("Cannot delete the only slide in the deck.");
        }
    };

    const deleteSlideDeck = () => {
        if (window.confirm("Are you sure you want to delete the entire slide deck?")) {
            const updatedSlides = slides.filter((_, index) => index !== parseInt(id));
            setSlides(updatedSlides);
            saveSlidesToBackend(updatedSlides);
            navigate('/dashboard');
        }
    };

    const saveSlidesToBackend = async (updatedSlides) => {
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
                throw new Error('Failed to save slides');
            }
        } catch (error) {
            console.error('Error saving slides:', error);
        }
    };

    return (
        <div className="edit-slides-container">
            {isToolbarVisible && (
                <ToolBar
                    selectedTextBox={selectedTextBox}
                    onAttributeChange={handleAttributeChange}
                    onClose={handleCloseToolbar}
                />
            )}

            <div className="slide-thumbnails">
                <h2>Slides</h2>
                {slideDeck.slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`thumbnail-item ${index === currentSlideIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    >
                        <div className="thumbnail-preview">
                            <div
                                className="thumbnail-content"
                                style={{ transform: 'scale(0.2)', transformOrigin: 'top left' }}
                                dangerouslySetInnerHTML={{ __html: slide.content }}
                            />
                        </div>
                    </div>
                ))}
                <button onClick={addSlide} className="add-slide-button">Add Slide</button>
            </div>

            <div className="slides-editor">
                <div className="title-container">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => {
                                setIsEditingTitle(false);
                                updateTitle(title);
                            }}
                            autoFocus
                            className="title-input"
                        />
                    ) : (
                        <h1 onClick={() => setIsEditingTitle(true)} className="editable-title">
                            {title} <button onClick={() => setIsEditingTitle(true)} className="edit-title-button">✏️</button>
                        </h1>
                    )}
                </div>

                <div className="slide-page">
                    <div className="slide-number">Slide {currentSlideIndex + 1}</div>
                    {textBoxes[currentSlideIndex].map((box) => (
                        <CustomTextBox
                            key={box.id}
                            id={box.id}
                            content={box.content}
                            position={box.position}
                            size={box.size}
                            color={box.color}
                            fontSize={box.fontSize}
                            onContentChange={handleAttributeChange}
                            onSelect={() => handleTextBoxSelect(box.id)}
                        />
                    ))}
                    {imageBoxes[currentSlideIndex].map((box) => (
                        <CustomImageBox
                            key={box.id}
                            id={box.id}
                            imageUrl={box.imageUrl}
                            position={box.position}
                            size={box.size}
                            alt={box.alt}
                        />
                    ))}
                    {videoBoxes[currentSlideIndex].map((box) => (
                        <CustomVideoBox
                            key={box.id}
                            id={box.id}
                            videoUrl={box.videoUrl}
                            videoFile={box.videoFile}
                            position={box.position}
                            size={box.size}
                            autoplay={box.autoplay}
                        />
                    ))}
                </div>

                <button onClick={addTextBox} className="add-textbox-button">Add Text Box</button>
                <button onClick={addImageBox} className="add-imagebox-button">Add Image</button>
                <button onClick={openVideoModal} className="add-videobox-button">Add Video</button>

                <div className="navigation-buttons">
                    <button
                        onClick={goToPreviousSlide}
                        disabled={currentSlideIndex === 0}
                        className={`nav-button ${currentSlideIndex === 0 ? 'disabled' : ''}`}
                    >
                        ⬅️ Previous
                    </button>
                    <button onClick={deleteSlide} className="delete-slide-button">Delete Current Slide</button>
                    <button
                        onClick={goToNextSlide}
                        disabled={currentSlideIndex === slideDeck.slides.length - 1}
                        className={`nav-button ${currentSlideIndex === slideDeck.slides.length - 1 ? 'disabled' : ''}`}
                    >
                        Next ➡️
                    </button>
                </div>

                <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">Back to Dashboard</button>
                <button onClick={deleteSlideDeck} className="delete-slide-deck-button">Delete Slide Deck</button>
            </div>

            {videoModalOpen && (
                <div className="modal-overlay" onClick={() => setVideoModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add Video</h3>
                        <label>
                            Source Type:
                            <select value={videoSourceType} onChange={(e) => setVideoSourceType(e.target.value)}>
                                <option value="url">URL</option>
                                <option value="file">File Upload</option>
                            </select>
                        </label>
                        {videoSourceType === 'url' ? (
                            <label>
                                Video URL:
                                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                            </label>
                        ) : (
                            <label>
                                Video File:
                                <input type="file" accept="video/*" onChange={handleFileUpload} />
                            </label>
                        )}
                        <label>
                            Autoplay:
                            <input
                                type="checkbox"
                                checked={autoplay}
                                onChange={(e) => setAutoplay(e.target.checked)}
                            />
                        </label>
                        <button onClick={handleAddVideo}>Add Video</button>
                        <button onClick={() => setVideoModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditSlides;
