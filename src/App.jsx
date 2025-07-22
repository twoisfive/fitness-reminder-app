import { useState } from 'react'
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
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

  useEffect(() => {
    LocalNotifications.requestPermissions().then(result => {
      if (result.display === 'granted') {
        console.log("Notification permission granted");
      }
    });
  }, []);

  const scheduleWoNotif = ( workoutName, time ) => {
    //set the time now
    const[hour, minute] = time.split(':').map(Number)
    //get now and scheduled workout
    const now = new Date();

    const baseTime = new Date();
    baseTime.setHours(hour, minute, 0, 0);

    // If time already passed today, push to tomorrow
    if (baseTime < now) {
      baseTime.setDate(baseTime.getDate() + 1);
    }

    // Create notification times
    const oneHourBefore = new Date(baseTime.getTime() - 60 * 60 * 1000); // -1 hour
    const onTime = baseTime;

    // Schedule pre-workout and on-time notifications
    const beforeId = Math.floor(Math.random() * 10000);
    const onTimeId = Math.floor(Math.random() * 10000);
    
    const notifications = [
      {
        title: '🏋️ Reminder',
        body: `"${workoutName}" in 1 hour!`,
        id: beforeId,
        schedule: { at: oneHourBefore },
      },
      {
        title: '🏋️ Start!',
        body: `Time for "${workoutName}"`,
        id: onTimeId,
        schedule: { at: onTime },
      }
    ];

    // Schedule repeated every hour after workout time
    const followUpNotificationIds = [];
    for (let i = 1; i <= 3; i++) {
      const followUpTime = new Date(baseTime.getTime() + i * 60 * 60 * 1000);
      const followUpId = Math.floor(Math.random() * 10000);
      followUpNotificationIds.push(followUpId);
      notifications.push({
        title: '⏰ Reminder',
        body: `Still haven't done "${workoutName}"?`,
        id: followUpId,
        schedule: { at: followUpTime },
      });
    }

    allNotificationIds = [beforeId, onTimeId, ...followUpNotificationIds]

    LocalNotifications.schedule({ notifications });
  };

  const handleCheckboxChange = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day) // uncheck
        : [...prev, day]             // check
    );
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    scheduleWoNotif(woName, woTime) //schedule notifs
    const newWorkout = {
      id: crypto.randomUUID(),
      name: woName,
      time: woTime,
      days: selectedDays
    }; //push new item
    const updatedWorkouts = [...myWorkouts, newWorkout];
    setMyWorkouts(updatedWorkouts);
    localStorage.setItem("myWorkouts", JSON.stringify(updatedWorkouts));

    //reset input fields
    setWoName("");
    setWoTime("");
    setSelectedDays([]);

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

  let allNotificationIds = [];

  

  const cancelAllWorkoutNotifications = async () => {
    await LocalNotifications.cancel({
      notifications: allNotificationIds.map(id => ({ id }))
    });
  };

  const handleFinishWorkout = () => {
    cancelAllWorkoutNotifications();
    updateStreak();
  }

  return (
    <main>
      <h1>🏋️‍♀️ Fitness Reminder</h1>
      {/*today section*/}
      <section id="today-section">
        <h2>🔥 Streak: <span id="streak-count">{streak.count}</span> days</h2>

        <h3>Today's Workouts</h3>
        <ul id="today-workout-list">
          {/*Where you put today's workout */}
          {todayWorkouts.map(w => (
            <li key={w.id}>
              <strong>{w.name}</strong> at <em>{w.time}</em>
             </li>
          ))}
        </ul>
        <button id="str-button" onClick={handleFinishWorkout}>Finish Workouts</button>
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
          <button id="add-button"  onClick={(e) => handleAddWorkout(e)} >Add Workout</button>
        </form>
      </section>

      <section id="workout-list">
        <h2>Scheduled Workouts</h2>
        <ul id="reminder-list">
          {myWorkouts.map(w => (
            <li key={w.id} class="workout-item">
              <span>
                <strong>{w.name}</strong> at <em>{w.time}</em> on{" "}  
                {w.days.map(d => dayNames[d]).join(", ")}{" "}
              </span>
              <span>
                <button onClick={() => handleDeleteWorkout(w.id)}>❌</button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
