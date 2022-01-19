import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const setUser = data => {
  return {
    type: 'SET_USER',
    payload: data,
  };
};

export const getUser = () => dispatch => {
    dispatch({type: 'USER_LOADING', payload: true});
    const unsubscribe = firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .onSnapshot(doc => {
      dispatch(setUser({...doc.data(), id: doc.id}));
    dispatch({type: 'USER_LOADING', payload: false});
    });
    return () =>unsubscribe();
};
