import React, { useState, useEffect } from "react";
import { db, auth, storage } from "./firebase"; // Import Firebase and Storage
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage methods
import MoodCalendar from "./MoodCalendar"; // Calendar component
import "./MoodTracker.css";

const MoodTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [moodText, setMoodText] = useState(""); // Mood text input
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date
  const [imageFile, setImageFile] = useState(null); // Image file state
  const [imageURL, setImageURL] = useState(""); // Image URL after upload

  // Open the modal
  const openModal = () => {
    console.log("Opening modal...");
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setMoodText(""); // Reset mood text
    setImageFile(null); // Reset image file
    setImageURL(""); // Reset image URL
  };

  // Log the modal state
  useEffect(() => {
    console.log("Modal State changed:", isModalOpen);
  }, [isModalOpen]);

  // Handle form submission (save mood and image)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || !moodText.trim()) {
      return; // Don't submit if no user or no mood text
    }

    try {
      let uploadedImageURL = "";
      
      // Upload image to Firebase Storage if there's a file
      if (imageFile) {
        const imageRef = ref(storage, `moods/${user.uid}/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        uploadedImageURL = await getDownloadURL(imageRef); // Get the uploaded image URL
      }

      // Get the date as a string in YYYY-MM-DD format
      const dateString = selectedDate.toISOString().split("T")[0];

      // Add mood to Firestore
      await addDoc(collection(db, "moods"), {
        userUid: user.uid,
        description: moodText,
        date: dateString,
        imageURL: uploadedImageURL, // Store the image URL if available
      });

      console.log("Mood saved!");
      closeModal(); // Close the modal after saving the mood
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store selected file in state
    }
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
            {/* Image upload input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button type="submit">Save Mood</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
