import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/globalStyles';

const WorkoutList = ({ myWorkouts, setMyWorkouts }) => {
  const handleDeleteWorkout = id => {
    const updated = myWorkouts.filter(w => w.id !== id);
    setMyWorkouts(updated);
  };

  return (
    <View>
      {myWorkouts.map(workout => (
        <View key={workout.id}>
          {/* Workout name + time */}
          <Text style={styles.cardTitle}>{workout.name}</Text>
          <Text style={styles.cardSubtitle}>Time: {workout.time}</Text>
          <Text style={styles.cardSubtitle}>
            Days: {workout.days.join(', ')}
          </Text>

          {/* Delete button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#d32f2f' }]} // darker red for delete
            onPress={() => handleDeleteWorkout(workout.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default WorkoutList;
