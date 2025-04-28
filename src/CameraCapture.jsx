import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import './CameraCapture.css';  
const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(100); 
    }
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
    onCapture(image);
  }, [onCapture]);

  return (
    <div className="camera-container">
      {!imageSrc ? (
        <>
          <div className="webcam-wrapper">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
              videoConstraints={{ facingMode: 'user' }}
            />
          </div>
          <button
            type="button"
            className="camera-button shutter-button"
            onClick={capture}
          >
            Capture
          </button>
        </>
      ) : (
        <>
          <div className="preview-wrapper">
            <img
              src={imageSrc}
              alt="Captured"
              className="preview-image"
            />
          </div>
          <button
            type="button"
            className="camera-button retake-button"
            onClick={() => setImageSrc(null)}
          >
            Retake
          </button>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
