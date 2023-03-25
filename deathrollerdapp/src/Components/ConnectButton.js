import React, { useState } from 'react';

const ConnectButton = ({ onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleConnectClick = () => {
    setShowPopup(true);
    onClick(); // call the parent component's onClick function
  }

  const handleCloseClick = () => {
    setShowPopup(false);
  }

  return (
    <>
      {showPopup ? (
        <div className="connect-popup">
          <div className="connect-popup-content">
            <p>Address:</p>
            <input type="text" placeholder="Wallet address" />
            <div className="connect-popup-buttons">
              <button onClick={handleCloseClick}>Cancel</button>
              <button>Connect</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="connect-button" onClick={handleConnectClick}>Connect Wallet</div>
        
      )
      }
      </>
     
  );
}

export { ConnectButton };
