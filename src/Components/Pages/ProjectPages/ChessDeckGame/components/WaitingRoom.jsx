import React, { useState } from 'react';

const WaitingRoom = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="cd-waiting-room">
      <div className="cd-waiting-title">Share this link with your opponent</div>
      <div className="cd-waiting-link-box">
        <input
          className="cd-waiting-link-input"
          value={link}
          readOnly
          onClick={(e) => e.target.select()}
        />
        <button className="cd-waiting-copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="cd-waiting-spinner" />
      <div className="cd-waiting-status">Waiting for opponent...</div>
    </div>
  );
};

export default WaitingRoom;
