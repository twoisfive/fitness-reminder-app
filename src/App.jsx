import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [woName, setWoName] = useState();
  const [woTime, setWoTime] = useState();
  const [woDays, setWoDays] = useState();
  const [selectedDays, setSelectedDays] = useState([]);

  const [myWorkouts, setMyWorkouts] = useState(() => {
  // Load from localStorage when component mounts
  const stored = localStorage.getItem("myWorkouts");
  return stored ? JSON.parse(stored) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak");
    return saved ? JSON.parse(saved) : { count: 0, lastCompleted: null };
  });
  const todayWorkouts = myWorkouts.filter(w => w.days.includes(new Date().getDay()))

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleCheckboxChange = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day) // uncheck
        : [...prev, day]             // check
    );
  };

  const handleAddWorkout = () => {
    const newWorkout = {
      id: crypto.randomUUID(),
      name: woName,
      time: woTime,
      days: selectedDays
    };
    const updatedWorkouts = [...myWorkouts, newWorkout];
    setMyWorkouts(updatedWorkouts);
    localStorage.setItem("myWorkouts", JSON.stringify(updatedWorkouts));
  };

  const handleDeleteWorkout = (id) => {
    const updatedWorkouts = myWorkouts.filter(w => w.id !== id);
    setMyWorkouts(updatedWorkouts);  // Update state (this causes the re-render)
    localStorage.setItem("myWorkouts", JSON.stringify(updatedWorkouts));// Persist to localStorage
  };

  const updateStreak = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Avoid double logging
    if (streak.lastCompleted === todayStr) {
      console.log("Already logged today");
      return (
        console.log(streak.count)
      );
    }

    const newCount = streak.lastCompleted === yesterdayStr ? streak.count + 1 : 1;
    const updatedStreak = {
      count: newCount,
      lastCompleted: todayStr
    };

    setStreak(updatedStreak); //change count & last completed
    localStorage.setItem("streak", JSON.stringify(updatedStreak)); //logs into local storage
  }


  return (
    <>
      <h1>🏋️‍♀️ Fitness Reminder</h1>
      {/*today section*/}
      <section id="today-section">
        <h2>🔥 Streak: <span id="streak-count">{streak.count}</span> days</h2>

        <h3>Today's Workouts</h3>
        <ul id="today-workout-list">
          {/*Where you put today's workout */}
          {todayWorkouts.map(w => (
            <li key={w.id}>
              <strong>{w.name}</strong> at <em>{w.time}</em> on{" "}  
              {w.days.map(d => dayNames[d]).join(", ")}{" "}
             </li>
          ))}
        </ul>
        <button id="str-button" onClick={updateStreak}>Finish Workouts</button>
      </section>

      {/*Add Workouts */}
      <section id="add-workout">
        <h2>Add a Workout</h2>
        <form id="workout-form">
          <label>
            Workout Name:
            <input
              type="text"
              id="workout-name"
              required
              value={woName}
              onChange={(e) => setWoName(e.target.value)}
            />
          </label>
          <label>
            Time:          
            <input
              type="time"
              id="workout-time"
              required
              value={woTime}
              onChange={(e) => setWoTime(e.target.value)}
            />
          </label>
          <fieldset>
            <legend>Days:</legend>
            {dayNames.map((day, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={index}
                  checked={selectedDays.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />{" "}
                {day}
              </label>
            ))}
          </fieldset>
          <button id="add-button" onClick={handleAddWorkout} >Add Workout</button>
        </form>
      </section>

      <section id="workout-list">
        <h2>Scheduled Workouts</h2>
        <ul id="reminder-list">
          {myWorkouts.map(w => (
            <li key={w.id}>
              <strong>{w.name}</strong> at <em>{w.time}</em> on{" "}  
              {w.days.map(d => dayNames[d]).join(", ")}{" "}
              <button onClick={() => handleDeleteWorkout(w.id)}>❌</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default App
