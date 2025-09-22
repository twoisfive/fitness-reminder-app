import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { handleAddWorkout } from '../../utils/addWorkout';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles/globalStyles';
import DaySelector from './DaySelector';
import { DAYS } from './DaySelector';

// the time picker doesnt work

const AddWorkoutSection = ({
  myWorkouts,
  setMyWorkouts,
  woName,
  setWoName,
  woTime,
  setWoTime,
  selectedDays,
  setSelectedDays,
}) => {
  const [time] = useState(new Date());
  const [show, setShow] = useState(false); //shows unchecked

  /*useEffect(() => {
    async function init() {
      const lastWorkoutDate = await AsyncStorage.getItem('lastWorkoutDate');
      const today = new Date().toISOString().split('T')[0];
      // how do I get 

      if (lastWorkoutDate != today && )
    }})*/
  // for later

  return (
    <View>
      <Text style={styles.cardTitle}>Add Workout</Text>

      {/* Workout Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Workout name"
        onChangeText={setWoName}
        value={woName}
      />

      {/* Pick Time Button */}
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.buttonText}>
          {woTime ? `Time: ${woTime}` : 'Pick Time'}
        </Text>
      </TouchableOpacity>

      {/* Time Picker */}
      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="clock"
          onChange={(e, selectedTime) => {
            setShow(false);
            if (selectedTime) {
              const hours = selectedTime.getHours().toString().padStart(2, '0');
              const minutes = selectedTime
                .getMinutes()
                .toString()
                .padStart(2, '0');
              setWoTime(`${hours}:${minutes}`);
            }
          }}
        />
      )}

      {/* Day Selector */}
      <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () =>
          await handleAddWorkout({
            DAYS: DAYS,
            woName: woName,
            woTime: woTime,
            selectedDays: selectedDays,
            myWorkouts: myWorkouts,
            setMyWorkouts: setMyWorkouts,
            setWoName: setWoName,
            setWoTime: setWoTime,
            setSelectedDays: setSelectedDays,
          })
        }
      >
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddWorkoutSection;
