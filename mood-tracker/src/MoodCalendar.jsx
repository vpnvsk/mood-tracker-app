import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import useMoods from "./useMoods";

const MoodCalendar = ({ selectedDate, setSelectedDate }) => {
  console.log("Selected Date in Calendar:", selectedDate); 

  const { moods, loading, error } = useMoods(selectedDate); 

  if (loading) {
    return <div>Loading moods...</div>;
  }

  if (error) {
    return <div>{error}</div>; 
  }

  const moodsByDate = moods.reduce((acc, mood) => {
    const date = mood.date.split("T")[0]; 
    if (!acc[date]) acc[date] = [];
    acc[date].push(mood);
    return acc;
  }, {});

  return (
    <div className="mood-calendar">
      <h2>Your Mood Calendar</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />
    </div>
  );
};

export default MoodCalendar;
