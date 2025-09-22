import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DaySelector = ({ selectedDays, onChange }) => {
  const toggleDay = day => {
    onChange(
      prev =>
        prev.includes(day)
          ? prev.filter(d => d !== day) // uncheck
          : [...prev, day], // check
    );
  };

  return (
    <View style={styles.container}>
      {DAYS.map(day => (
        <View key={day} style={styles.row}>
          <CheckBox
            value={selectedDays.includes(day)}
            onValueChange={() => toggleDay(day)}
          />
          <Text style={{ marginLeft: 8 }}>{day}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
});

export default DaySelector;
