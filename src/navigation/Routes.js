import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppStack from './AppStack';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import {LogBox} from 'react-native';
import UserIsBlocked from './../screens/UserIsBlocked/UserIsBlocked';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {onAuthStateChanged} from '../redux/actions/user';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const Routes = () => {
  const dispatch = useDispatch();
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      firestore()
          .collection('users')
          .doc(user?.uid)
          .onSnapshot(doc => {
            setIsBlocked(doc?.data()?.isBlocked);
          });
     if (initializing) setInitializing(false)
    });
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) {
    return null;
  }
  if (!user) 
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  return (
    <NavigationContainer>
      {isBlocked?<UserIsBlocked />:<AppStack />}
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({});
