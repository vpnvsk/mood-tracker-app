import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./MoodCalendar.css"; 

function MoodCalendar({ selectedDate, setSelectedDate, refreshKey }) {
  const [monthCounts, setMonthCounts] = useState({});  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthCounts = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const first = new Date(year, month, 1);
      const last  = new Date(year, month + 1, 0);

      const toISODay = d => d.toLocaleDateString("en-CA").slice(0,10);

      const q = query(
        collection(db, "moods"),
        where("userUid", "==", user.uid),
        where("date", ">=", toISODay(first)),
        where("date", "<=", toISODay(last))
      );

      try {
        const snap = await getDocs(q);
        const counts = {};
        snap.docs.forEach(doc => {
          const { date } = doc.data();  
          counts[date] = (counts[date] || 0) + 1;
        });
        setMonthCounts(counts);
      } catch (e) {
        console.error(e);
        setError("Failed to load mood counts");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthCounts();
    }, [selectedDate, refreshKey]);   

  if (loading) return <div>Loading calendar…</div>;
  if (error)   return <div>{error}</div>;

  return (
    <div className="mood-calendar">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const dayKey = date.toLocaleDateString("en-CA").slice(0,10);
            const count = monthCounts[dayKey];
            return count ? (
              <div className="mood-badge">
                {count}
              </div>
            ) : null;
          }
        }}
      />
    </div>
  );
}

export default MoodCalendar;
