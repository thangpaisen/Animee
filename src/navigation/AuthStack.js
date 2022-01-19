import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionPresets} from '@react-navigation/stack';
import SignIn from "./../screens/Auth/SignIn";
import SignUp from "./../screens/Auth/SignUp";

const Stack = createStackNavigator();
const AuthStack = () => {
    return (
        <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
    )
}

export default AuthStack

const styles = StyleSheet.create({})
