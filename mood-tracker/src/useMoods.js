import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const useMoods = (selectedDate) => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Selected date changed:", selectedDate); 
    const fetchMoods = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("No user is logged in");
        setLoading(false);
        return;
      }

      try {
        const moodsCollection = collection(db, "moods");
        const selectedDateString = selectedDate.toLocaleDateString("en-CA"); 

        const q = query(
          moodsCollection,
          where("userUid", "==", user.uid),
          where("date", "==", selectedDateString)
        );


        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log("No moods found for this date.");
        }

        console.log(querySnapshot);
        const moodsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMoods(moodsData);
      } catch (error) {
        console.log("Firebase query error:", error);
        setError("Error fetching moods: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, [selectedDate]);

  return { moods, loading, error };
};

export default useMoods;
