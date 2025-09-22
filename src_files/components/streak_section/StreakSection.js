import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import {
  saveWorkoutCompletion,
  streakReset,
} from '../../utils/streakFunctions';
import styles from '../../styles/globalStyles';

const StreakSection = ({ myWorkouts }) => {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const todayName = DAYS[new Date().getDay()];

  //learn what filter does
  const todayWorkouts = myWorkouts.filter(w => w.days.includes(todayName));
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    streakReset(setStreakCount);
  }, []);

  return (
    <View>
      {/* Streak Info */}
      <Text style={styles.cardTitle}>Streak: {streakCount}</Text>
      <Text style={styles.cardSubtitle}>Today's Workout:</Text>

      {todayWorkouts.length > 0 ? (
        todayWorkouts.map(workout => (
          <View key={workout.id} style={styles.item}>
            <Text style={styles.name}>{workout.name}</Text>
            <Text style={styles.cardSubtitle}>{workout.time}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.cardSubtitle}>No workouts today!</Text>
      )}

      {/* Finish Workout Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => saveWorkoutCompletion(setStreakCount)}
      >
        <Text style={styles.buttonText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StreakSection;
