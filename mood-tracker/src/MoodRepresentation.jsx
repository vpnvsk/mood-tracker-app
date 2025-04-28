import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./MoodRepresentation.css";

const MoodRepresentation = ({ moods, setMoods, setRefreshKey }) => {
    const [selectedImage, setSelectedImage] = useState(null);
  const [moodToDelete, setMoodToDelete] = useState(null);


  if (moods.length === 0) {
    return <p>No moods for this day yet.</p>;
  }

  const confirmDelete = async () => {
    if (!moodToDelete) return;

    try {
      await deleteDoc(doc(db, "moods", moodToDelete));
      setMoods(prevMoods => prevMoods.filter(mood => mood.id !== moodToDelete));
      setMoodToDelete(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error deleting mood:", error);
      alert("Failed to delete mood.");
    }
  };

  const moodsByDate = moods.reduce((acc, mood) => {
    let formattedDate = new Date(mood.date);
    const date = formattedDate.toLocaleDateString("en-CA");
    if (!acc[date]) acc[date] = [];
    acc[date].push(mood);
    return acc;
  }, {});

  return (
    <div className="mood-list">
      {Object.entries(moodsByDate).map(([date, moodGroup]) => (
        <div key={date} className="mood-day">
          <h3>{new Date(date).toLocaleDateString()}</h3>
          <div className="mood-cards">
            {moodGroup.map((mood) => (
              <div key={mood.id} className="mood-card">
                <p>{mood.description}</p>
                {mood.imageURL && (
                  <img
                    src={mood.imageURL}
                    alt="Mood"
                    className="mood-image"
                    onClick={() => setSelectedImage(mood.imageURL)}
                  />
                )}
                <button
                  className="delete-button"
                  onClick={() => setMoodToDelete(mood.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Selected Mood" className="full-screen-image" />
        </div>
      )}

      {/* Confirmation Modal */}
      {moodToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Mood?</h3>
            <p>Are you sure you want to delete this mood?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmDelete}>Yes, Delete</button>
              <button className="cancel-button" onClick={() => setMoodToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodRepresentation;
