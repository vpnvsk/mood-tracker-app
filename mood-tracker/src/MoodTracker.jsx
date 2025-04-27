import React, { useState, useEffect, useRef } from "react";
import { db, auth, storage } from "./firebase"; // Import Firebase and Storage
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // Firebase storage methods
import MoodCalendar from "./MoodCalendar"; // Calendar component
import Webcam from "react-webcam"; // Webcam library
import "./MoodTracker.css";

const MoodTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodText, setMoodText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [moods, setMoods] = useState([]); // <<< moods array

  const webcamRef = useRef(null);

  // Open the modal
  const openModal = () => {
    console.log("Opening modal...");
    setIsModalOpen(true);
    setIsCameraOn(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setMoodText("");
    setCapturedImage(null);
    setIsCameraOn(false);
  };

  // Log the modal state
  useEffect(() => {
    console.log("Modal State changed:", isModalOpen);
  }, [isModalOpen]);

  // Fetch moods from Firestore
  const fetchMoods = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const moodsRef = collection(db, "moods");
      const q = query(moodsRef, where("userUid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const moodsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMoods(moodsData);
      console.log("Fetched moods:", moodsData);
    } catch (error) {
      console.error("Error fetching moods:", error);
    }
  };

  // Fetch moods on component mount
  useEffect(() => {
    fetchMoods();
  }, []);

  // Handle form submission (save mood and image)
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
      let uploadedImageURL = "";
  
      // Upload captured image
      const imageRef = ref(storage, `moods/${user.uid}/${Date.now()}.jpg`);
      await uploadString(imageRef, capturedImage, "data_url");
      uploadedImageURL = await getDownloadURL(imageRef);
  
      const dateString = selectedDate.toISOString().split("T")[0];
  
      // Save mood to Firestore
      await addDoc(collection(db, "moods"), {
        userUid: user.uid,
        description: moodText,
        date: dateString,
        imageURL: uploadedImageURL,
      });
  
      console.log("Mood saved!");
      closeModal();
  
      // Fetch updated moods
      await fetchMoods();
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };
  

  // Handle capture photo
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCameraOn(false);
    }
  };

  // Handle retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraOn(true);
  };

  return (
    <div>
      <h1>Welcome to your Mood Tracker</h1>

      {/* Render the MoodCalendar component */}
      <MoodCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* New Mood Button */}
      <button onClick={openModal} className="new-mood-button">
        +
      </button>

      {/* Show list of moods */}
      <div className="moods-list">
        {moods.map((mood) => (
          <div key={mood.id} className="mood-item">
            <p><strong>{mood.date}</strong>: {mood.description}</p>
            {mood.imageURL && (
              <img
                src={mood.imageURL}
                alt="Mood"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal for Creating Mood */}
      <div className={`modal ${isModalOpen ? "show" : ""}`}>
        <div className="modal-content">
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
          <h2>Create a New Mood</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="Describe your mood..."
              rows="4"
              required
            />

            {/* Capture photo section */}
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
