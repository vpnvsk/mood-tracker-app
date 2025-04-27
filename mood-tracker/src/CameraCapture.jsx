// src/CameraCapture.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = React.useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
    onCapture(image); // Pass the captured image to parent
  }, [webcamRef, onCapture]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        videoConstraints={{
          facingMode: 'user',
        }}
      />
      <button onClick={capture}>Capture</button>
      {imageSrc && <img src={imageSrc} alt="Captured" />}
    </div>
  );
};

export default CameraCapture;
