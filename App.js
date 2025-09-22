/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { ScrollView } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import styles from './src_files/styles/globalStyles';
import AddWorkoutSection from './src_files/components/add_workout_section/AddWorkoutSection';
import StreakSection from './src_files/components/streak_section/StreakSection';
import WorkoutList from './src_files/components/workout_list/WorkoutList';

// notif created
// notif now does each workout notif weekly
// Next step: make widget, clean up code
// Components needed
// Helper functions -> set workout

// turn into own component

const App = () => {
  const [woName, setWoName] = useState();
  const [woTime, setWoTime] = useState();
  const [selectedDays, setSelectedDays] = useState([]);

  const [myWorkouts, setMyWorkouts] = useState([]);

  useEffect(() => {
    async function init() {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus >= 1) {
        console.log('✅ Notification permission granted');
      } else {
        console.log('❌ Permission denied');
      }

      await notifee.createChannel({
        id: 'test-channel',
        name: 'Test Channel',
        importance: AndroidImportance.MAX, // heads-up
      });

      console.log('✅ Notification channel created');
    }

    init();
  }, []);

  useEffect(() => {
    // Register background handler exactly once
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('Background event fired:', type, detail.notification?.title);
    });
  }, []);

  /*const showTriggerNotification = async () => {
    const now = new Date();
    const triggerDate = new Date(now.getTime() + 5000); // 5 seconds

    await notifee.createTriggerNotification(
      {
        title: 'Trigger Notification',
        body: 'This should appear in 5 seconds',
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
      },
    );
  };*/

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const stored = await AsyncStorage.getItem('myWorkouts');
        if (stored) {
          setMyWorkouts(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load workouts:', err);
      }
    };

    loadWorkouts();
  }, []);

  /*const [streak, setStreak] = useState(() => {
    const saved = AsyncStorage.getItem('streak');
    return saved ? JSON.parse(saved) : { count: 0, lastCompleted: null };

  });
  const todayWorkouts = myWorkouts.filter(w =>
    w.days.includes(new Date().getDay()),
  );*/

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Upcoming Workouts</Text>
        </View>

        {/* Streak Section */}
        <View style={styles.card}>
          <StreakSection myWorkouts={myWorkouts} />
        </View>

        {/* Greeting / Placeholder */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hello, world!</Text>
          <Text style={styles.cardSubtitle}>Let’s get moving today 💪</Text>
        </View>

        {/* Add Workout Section */}
        <View style={styles.card}>
          <AddWorkoutSection
            myWorkouts={myWorkouts}
            setMyWorkouts={setMyWorkouts}
            woName={woName}
            setWoName={setWoName}
            woTime={woTime}
            setWoTime={setWoTime}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        </View>

        {/* Workout List */}
        <View style={styles.card}>
          <WorkoutList myWorkouts={myWorkouts} setMyWorkouts={setMyWorkouts} />
        </View>

        {/* Example button (like “Book Now”) */}
      </View>
    </ScrollView>
  );
};

export default App;
