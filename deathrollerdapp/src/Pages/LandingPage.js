import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  }

  return (
    <div className="landing-page">
      <div className="background-image">
        <div className="landing-page-content">
          <button onClick={handleClick}>ENTER</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
