import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';
import PlayPart from './playPart';
import HomeScreen from './homeScreen';

const Stack = createNativeStackNavigator();
const setUpTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
  } catch (e) {
    console.log(e);
  }
};

{/**AppNavigator can change screens */}

export default AppNavigator = () => {
  setUpTrackPlayer()
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Play" component={PlayPart}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
};