import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { v4 as uuidv4 } from 'uuid';
import { NativeModules } from 'react-native';

const { WorkoutWidgetModule } = NativeModules;

function setDateToDay(baseDate, targetDayIndex) {
  // baseDate = any Date object you want as a starting point
  // targetDayIndex = 0 (Sun) ... 6 (Sat), same as getDay()

  let result = new Date(baseDate); // copy so we don't mutate the original
  let currentDay = result.getDay();

  // distance to target day
  let diff = (targetDayIndex + 7 - currentDay) % 7;

  // shift date forward
  result.setDate(result.getDate() + diff);

  console.log(result.getDate());

  return result;
}

async function addWorkoutObject(
  woName,
  woTime,
  selectedDays,
  myWorkouts,
  setMyWorkouts,
  setWoName,
  setWoTime,
  setSelectedDays,
) {
  const newWorkout = {
    id: uuidv4(),
    name: woName,
    time: woTime,
    days: selectedDays,
  };
  const updatedWorkouts = [...myWorkouts, newWorkout];
  setMyWorkouts(updatedWorkouts);
  await AsyncStorage.setItem('myWorkouts', JSON.stringify(updatedWorkouts));

  //reset input fields
  setWoName('');
  setWoTime('');
  setSelectedDays([]);
}

async function scheduleWoNotification(woTime, selectedDays, DAYS) {
  const now = new Date();
  const [h, m] = woTime.split(':').map(Number);
  console.log(woTime); // Sat Aug 23 2025 15:30:00 GMT+0700

  for (const dayStr of selectedDays) {
    try {
      const dayIndex = DAYS.indexOf(dayStr);
      if (dayIndex < 0) continue; // safety
      console.log('Day:', dayStr, '→ Index:', dayIndex);

      const triggerDate = new Date();
      triggerDate.setTime(setDateToDay(now, dayIndex).getTime());
      triggerDate.setHours(h);
      triggerDate.setMinutes(m);
      triggerDate.setSeconds(0);
      triggerDate.setMilliseconds(0);

      if (triggerDate.getTime() <= Date.now()) {
        triggerDate.setDate(triggerDate.getDate() + 7); // push to next week
      }

      console.log(triggerDate.getTime());

      await notifee.createTriggerNotification(
        {
          title: 'Trigger Notification',
          body: 'Testing the notifications',
          android: {
            channelId: 'test-channel',
            category: 'alarm',
            fullScreenAction: { id: 'default' },
            pressAction: { id: 'default' },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerDate.getTime(),
          alarmManager: true,
          repeatFrequency: RepeatFrequency.WEEKLY,
        },
      );
      console.log('Notification successfully scheduled');
    } catch (err) {
      console.error('❌ Failed to schedule notification for', dayStr, err);
    }
  }
}

export async function handleAddWorkout({
  DAYS,
  woName,
  woTime,
  selectedDays,
  myWorkouts,
  setMyWorkouts,
  setWoName,
  setWoTime,
  setSelectedDays,
}) {
  await addWorkoutObject(
    woName,
    woTime,
    selectedDays,
    myWorkouts,
    setMyWorkouts,
    setWoName,
    setWoTime,
    setSelectedDays,
  );
  await scheduleWoNotification(woTime, selectedDays, DAYS);
}
