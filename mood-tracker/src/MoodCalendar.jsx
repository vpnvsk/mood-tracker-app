import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase"; // Import Firestore and auth
import { collection, query, where, getDocs } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles

const MoodCalendar = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track selected date

  useEffect(() => {
    const fetchMoods = async () => {
      const user = auth.currentUser; // Get the current user

      if (!user) {
        setError("No user is logged in");
        setLoading(false);
        return;
      }

      try {
        const moodsCollection = collection(db, "moods"); // Reference to the "moods" collection
        const q = query(moodsCollection, where("userUid", "==", user.uid)); // Query moods by user UID

        const querySnapshot = await getDocs(q);
        const moodsArray = [];

        querySnapshot.forEach((doc) => {
          moodsArray.push(doc.data()); // Add each mood to the array
        });

        setMoods(moodsArray); // Set the moods state
      } catch (error) {
        setError("Error fetching moods: " + error.message); // Show error message
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchMoods();
  }, []);

  if (loading) {
    return <div>Loading moods...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  // Group moods by date
  const moodsByDate = moods.reduce((acc, mood) => {
    const date = mood.date.split("T")[0]; // Use only the date part (assuming mood.date is a timestamp or ISO string)
    if (!acc[date]) acc[date] = [];
    acc[date].push(mood);
    return acc;
  }, {});

  // Format selected date as string (for comparison)
  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  return (
    <div>
      <h2>Your Mood Calendar</h2>
      <Calendar
        onChange={setSelectedDate} // Handle date selection
        value={selectedDate} // Display the selected date
      />
      <div>
        <h3>Moods for {selectedDateStr}</h3>
        {moodsByDate[selectedDateStr] ? (
          <ul>
            {moodsByDate[selectedDateStr].map((mood, index) => (
              <li key={index}>{mood.description || "No description"}</li>
            ))}
          </ul>
        ) : (
          <p>No moods for this day.</p>
        )}
      </div>
    </div>
  );
};

export default MoodCalendar;
