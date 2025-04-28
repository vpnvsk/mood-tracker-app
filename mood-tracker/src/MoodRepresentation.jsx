import React, { useState } from "react";
import "./MoodRepresentation.css"; 

const MoodRepresentation = ({ moods }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (moods.length === 0) {
    return <p>No moods for this day yet.</p>;
  }

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
    </div>
  );
};

export default MoodRepresentation;
