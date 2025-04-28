import React, { useState, useRef } from "react";
import { db, auth, storage } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import MoodCalendar from "./MoodCalendar";
import Webcam from "react-webcam";
import useMoods from "./useMoods";
import MoodRepresentation from "./MoodRepresentation";
import "./MoodTracker.css";

const MoodTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodText, setMoodText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const webcamRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
    setIsCameraOn(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMoodText("");
    setCapturedImage(null);
    setIsCameraOn(false);
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { moods } = useMoods(selectedDate); 

  const handleDateSelect = (date) => {
    setSelectedDate(date); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !moodText.trim()) {
      alert("Please describe your mood.");
      return;
    }
    if (!capturedImage) {
      alert("Please take a photo before submitting.");
      return;
    }

    try {
      const imageRef = ref(storage, `moods/${user.uid}/${Date.now()}.jpg`);
      await uploadString(imageRef, capturedImage, "data_url");
      const uploadedImageURL = await getDownloadURL(imageRef);

      const dateString = selectedDate.toLocaleDateString("en-CA");
      await addDoc(collection(db, "moods"), {
        userUid: user.uid,
        description: moodText,
        date: dateString,
        imageURL: uploadedImageURL,
      });

      closeModal();
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCameraOn(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraOn(true);
  };

  return (
    <div className="mood-tracker-container">
      <h1>How was your day today?</h1>

      <div className="mood-calendar-container">
        <MoodCalendar
          selectedDate={selectedDate}
          setSelectedDate={handleDateSelect}
        />
      </div>

      <p className="selected-date-label">
        Selected Date: {formatSelectedDate(selectedDate)}
      </p>

      <button onClick={openModal} className="new-mood-button">
        +
      </button>

      <MoodRepresentation moods={moods} />

      {/* Image Popup */}
      {selectedImage && (
        <div className="image-popup" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Expanded Mood" />
        </div>
      )}

      {/* Modal */}
      <div className={`modal ${isModalOpen ? "show" : ""}`}>
        <div className="modal-content">
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
          <h2>Add a Mood</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="How do you feel today?"
              rows="4"
              required
            />
            <div>
              {isCameraOn && !capturedImage && (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    style={{ width: "100%", maxWidth: 300 }}
                  />
                  <button type="button" onClick={handleCapture}>
                    Capture Photo
                  </button>
                </div>
              )}
              {capturedImage && (
                <div>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{ width: "100%", maxWidth: 300 }}
                  />
                  <button type="button" onClick={handleRetake}>
                    Retake
                  </button>
                </div>
              )}
            </div>
            <button type="submit">Save Mood</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
