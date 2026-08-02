import React, { useRef, useState } from 'react';

const WaitingRoom = ({ link }) => {
  const [status, setStatus] = useState(null); // 'copied' | 'failed'
  const inputRef = useRef(null);

  // Copying is the only way to start an online game, and it can fail for
  // ordinary reasons — an insecure context, a permission prompt, Safari
  // treating the call as gesture-detached. Selecting the text is the fallback,
  // so the link is always obtainable.
  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(link);
      setStatus('copied');
      setTimeout(() => setStatus(null), 2000);
    } catch {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
      setStatus('failed');
    }
  };

  return (
    <div className="cd-waiting-room">
      <div className="cd-waiting-title">Share this link with your opponent</div>
      <div className="cd-waiting-link-box">
        <input
          ref={inputRef}
          className="cd-waiting-link-input"
          value={link}
          readOnly
          aria-label="Invite link"
          onClick={(e) => e.target.select()}
        />
        <button type="button" className="cd-waiting-copy-btn" onClick={handleCopy}>
          {status === 'copied' ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div aria-live="polite" className="cd-waiting-copy-note">
        {status === 'failed' ? 'Copy failed — the link is selected, press Ctrl+C.' : ''}
      </div>
      <div className="cd-waiting-spinner" />
      <div className="cd-waiting-status">Waiting for opponent…</div>
    </div>
  );
};

export default WaitingRoom;
