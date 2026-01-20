import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./FeedbackLanding.css";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const BASE_URL = "http://localhost:8080";

function FeedbackLanding() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchAllFeedback();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0 && !isPaused) {
      startAutoSlide();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [feedbacks.length, isPaused, currentIndex]);

  const fetchAllFeedback = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/feedback/all-feedback`);
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedback", error);
    } finally {
      setLoading(false);
    }
  };

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % feedbacks.length);
    }, 4000);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + feedbacks.length) % feedbacks.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % feedbacks.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`fbl-star ${index < rating ? 'fbl-star-filled' : 'fbl-star-empty'}`}
      />
    ));
  };

  const getVisibleSlides = () => {
    const slides = [];
    const total = feedbacks.length;
    
  
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + total) % total;
      slides.push({
        ...feedbacks[index],
        index,
        position: i 
      });
    }
    
    return slides;
  };

  if (loading) {
    return (
      <div className="fbl-container">
        <h2 className="fbl-heading">What Our Users Say</h2>
        <div className="fbl-loading">
          <FiLoader className="fbl-spinner" />
          <p>Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="fbl-container">
        <h2 className="fbl-heading">What Our Users Say</h2>
        <div className="fbl-empty">
          <p>No feedback available yet.</p>
        </div>
      </div>
    );
  }

  const visibleSlides = getVisibleSlides();

  return (
    <div 
      className="fbl-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="fbl-header">
        <h2 className="fbl-heading">
          <span className="fbl-heading-icon">💬</span>
          Trusted by Our Users
        </h2>
        <p className="fbl-subheading">Real feedback from our community</p>
      </div>

      <div className="fbl-carousel-wrapper">
        <button className="fbl-nav-btn fbl-prev-btn" onClick={handlePrev}>
          <FaChevronLeft />
        </button>
        
        <div className="fbl-horizontal-carousel" ref={containerRef}>
          {visibleSlides.map((fb) => (
            <div 
              key={fb.feedbackId}
              className={`fbl-slide ${fb.position === 0 ? 'fbl-slide-active' : ''} 
                         ${fb.position === -1 ? 'fbl-slide-left' : ''} 
                         ${fb.position === 1 ? 'fbl-slide-right' : ''}`}
            >
              <div className="fbl-slide-inner">
                <FaQuoteLeft className="fbl-quote-icon" />
                
                <div className="fbl-rating">
                  {renderStars(fb.ratings)}
                  <span className="fbl-rating-number">{fb.ratings}.0</span>
                </div>
                
                <p className="fbl-message">"{fb.feedback_desc}"</p>
                
                <div className="fbl-user-info">
                  <div className="fbl-user-avatar">
                    {fb.userInfo?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="fbl-user-details">
                    <span className="fbl-username">{fb.userInfo?.username || 'Anonymous'}</span>
                    <span className="fbl-date">{fb.feedbackDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="fbl-nav-btn fbl-next-btn" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>

      
      <div className="fbl-indicators">
        {feedbacks.map((_, index) => (
          <button
            key={index}
            className={`fbl-indicator ${index === currentIndex ? 'fbl-indicator-active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to feedback ${index + 1}`}
          />
        ))}
      </div>

     
      <div className="fbl-counter">
        <span className="fbl-current">{currentIndex + 1}</span>
        <span className="fbl-counter-separator">/</span>
        <span className="fbl-total">{feedbacks.length}</span>
      </div>
    </div>
  );
}

export default FeedbackLanding;