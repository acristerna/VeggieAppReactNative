import React from 'react';
import {
  View,
  Text, 
  StyleSheet,
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  FlatList
 } from 'react-native';
 import WelcomeScreen from './src/AppSwitchNavigator/WelcomeScreen';
 import TestScreen from './src/AppSwitchNavigator/TestScreen';
 import VeggieApp from './src/components/index'

 import { createAppContainer, createSwitchNavigator} from 'react-navigation';

const App = () => <AppContainer />;

const AppSwitchNavigator = createSwitchNavigator({
   WelcomeScreen: WelcomeScreen,
   VeggieApp,
   TestScreen: TestScreen
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;

