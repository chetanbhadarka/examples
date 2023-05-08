import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import HomeScreen from './screens/HomeScreen';
import CircularSliderScreen from './screens/CircularSliderScreen';
import ReactionButtonScreen from './screens/ReactionButtonScreen';
import ReduxWithAPIScreen from './screens/ReduxWithAPIScreen';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CircularSlider" component={CircularSliderScreen} />
        <Stack.Screen name="ReactionButton" component={ReactionButtonScreen} />
        <Stack.Screen name="ReduxWithAPI" component={ReduxWithAPIScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
