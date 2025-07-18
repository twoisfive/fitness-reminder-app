//logging in workouts is done
// delete button -> pick which object to delete, delete from local storage

let myWorkouts = [];
const addBtn = document.getElementById("add-button");
const woName = document.getElementById("workout-name");
const woTime = document.getElementById("workout-time");
const ulEl = document.getElementById("reminder-list");
const ulElTdy = document.getElementById("today-workout-list");
const form = document.getElementById("workout-form");
const strCount = document.getElementById("streak-count");
const strBtn = document.getElementById("str-button");

const workoutsFromStorage = JSON.parse(localStorage.getItem("myWorkouts")); //what does parse do?
if (workoutsFromStorage) {
  myWorkouts = workoutsFromStorage;
  render(myWorkouts);
  renderToday(myWorkouts);
}

strCount.innerHTML = updateStreak();

function canCountStreak(workout, currentDay) {
  return workout.days.includes(currentDay);
} //counts streak

function updateStreak(){
    const streak = JSON.parse(localStorage.getItem("streak")) || {
    count: 0,
    lastCompleted: null
    }; //either get streak item or make it


    const todayStr = new Date().toISOString().split("T")[0];

    if (streak.lastCompleted === todayStr) {
        console.log("Already logged today");
        return streak.count;
    }  // already logged today

    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (streak.lastCompleted === yesterdayStr) {
        streak.count += 1;
    } else {
        streak.count = 1;
    }

    strCount.innerHTML = streak.count
    streak.lastCompleted = todayStr;
    localStorage.setItem("streak", JSON.stringify(streak));
    return streak.count;
}

function deleteWorkout(index) {
  // Step 1: Remove from the array
  myWorkouts.splice(index, 1);

  // Step 2: Save updated array
  localStorage.setItem("myWorkouts", JSON.stringify(myWorkouts));

  // Step 3: Re-render updated list
  render(myWorkouts);
  renderToday(myWorkouts);
}

function render(workout) {
    let workoutItems = '';
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < workout.length; i++ ) {
        const w = workout[i];  
        const readableDays = w.days.map(d => dayNames[d]).join(", ");
        workoutItems += `
        <li>
            <strong>${w.name}</strong> at <em>${w.time}</em> on days:
            ${readableDays} 
            <button onclick="deleteWorkout(${i})">❌</button>
        </li>`
    }
    ulEl.innerHTML = workoutItems 
} 

function renderToday(workout){
    const now = new Date();
    const currentDay = now.getDay();
    let workoutItems = '';

    workout.forEach(w => {
    if (w.days.includes(currentDay)) {
        workoutItems += `
        <li>
            <strong>${w.name}</strong> at <em>${w.time}
        </li>`
    };
  });
  ulElTdy.innerHTML = workoutItems
}

setInterval(() => {
  const now = new Date();
  const currentDay = now.getDay(); 
  const currentTime = now.toTimeString().slice(0, 5); 

  myWorkouts.forEach(w => {
    if (w.time === currentTime && w.days.includes(currentDay)) {
      alert(`Reminder: Time for ${w.name}`); //change this to notif API later

      if(canCountStreak(w, currentDay)) {
        
      }
    }
  });
}, 60000);

addBtn.addEventListener("click", function(e) {
    e.preventDefault()

    const name = woName.value.trim();
    const time = woTime.value;

    const selectedDays = Array.from(
    form.querySelectorAll('input:checked')
    ).map(cb => parseInt(cb.value))

    if (!name || !time || selectedDays.length === 0) {
        alert("Please fill in both the workout name and time.");
        return;
    }

    const newWorkout = {
    name: woName.value,
    time: woTime.value,
    days: selectedDays
    } 
    //put newWorkout into whats pushed?
    myWorkouts.push(newWorkout) //how do I push an object to an array
    localStorage.setItem( "myWorkouts", JSON.stringify(myWorkouts))
    render(myWorkouts)
    renderToday(myWorkouts)
    woName.value = ''
    woTime.value = ''
})

strBtn.addEventListener("click", function(e) {
    e.preventDefault()
    updateStreak()
})





//make an object that stores myworkouts
//the myworkouts should contain the name, the time, and the days
//contain my workout in local storage




