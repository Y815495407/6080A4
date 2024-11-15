import React, { useState } from 'react';
import './PreviewSlides.css';

function PreviewSlides({ slides }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const goToNextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    return (
        <div className="preview-container">
            <div className="slide-number">
                Slide {currentSlideIndex + 1} / {slides.length}
            </div>
            <div className="slide-content">
                <div
                    className="slide"
                    dangerouslySetInnerHTML={{
                        __html: slides[currentSlideIndex].content,
                    }}
                />
            </div>
            <button className="nav-button prev-button" onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
                ⬅️
            </button>
            <button className="nav-button next-button" onClick={goToNextSlide} disabled={currentSlideIndex === slides.length - 1}>
                ➡️
            </button>
        </div>
    );
}

export default PreviewSlides;
