// src/components/Carousel.jsx
import { useState, useEffect } from 'react';
import './Carousel.css'; // Crearemos este archivo de estilos a continuación

export default function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Efecto para el auto-play
  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 5000); // Cambia de imagen cada 5 segundos

    // Limpieza: resetea el timer si el usuario cambia de imagen manualmente
    return () => clearTimeout(timer);
  }, [currentIndex]);


  return (
    <div className="carousel-container">
      <div className="carousel-slide-wrapper">
        <div 
          className="carousel-slide" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div className="carousel-item" key={index}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-btn prev" onClick={goToPrevious}>&#10094;</button>
      <button className="carousel-btn next" onClick={goToNext}>&#10095;</button>
      <div className="carousel-dots">
        {images.map((_, slideIndex) => (
          <div 
            key={slideIndex} 
            className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(slideIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
}