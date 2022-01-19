import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Providers from "./src/navigation";
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();
const App = () => {
  return (
      <>
    <Providers/>
    <Toast />
    </>
  );
};
export default App;

const styles = StyleSheet.create({});
