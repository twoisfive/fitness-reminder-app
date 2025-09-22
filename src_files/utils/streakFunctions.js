import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveWorkoutCompletion(setStreakCount) {
  // use that if lastWorkoutDate != today then schedule notif
  const today = new Date().toISOString().split('T')[0];
  //splits ["2025-08-18", "01:30:45.123Z"] and takes [0] -> 2025-08-18

  const lastWorkoutDate = await AsyncStorage.getItem('lastWorkoutDate');

  if (!lastWorkoutDate) {
    setStreakCount(1);
    await AsyncStorage.setItem('lastWorkoutDate', today);
    console.log(today);
  } else if (lastWorkoutDate === today) {
    console.log('you already finished your workout today');
    //put up a popup screen that says you already did a workout today
  } else {
    setStreakCount(prev => prev + 1);
    await AsyncStorage.setItem('lastWorkoutDate', today);
    console.log(lastWorkoutDate);
  }
}

export async function streakReset(setStreakCount) {
  const lastWorkoutDate = await AsyncStorage.getItem('lastWorkoutDate');
  const today = new Date().toISOString().split('T')[0];

  const yester = new Date();
  yester.setDate(yester.getDate() - 1);
  const yesterday = yester.toISOString().split('T')[0];

  if (
    lastWorkoutDate &&
    lastWorkoutDate !== today &&
    lastWorkoutDate !== yesterday
  ) {
    setStreakCount(0);
  }
}
