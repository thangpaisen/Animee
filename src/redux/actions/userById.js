import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const setUserById = data => {
  return {
    type: 'SET_USER_BY_ID',
    payload: data,
  };
};

export const getUserById = (id) => dispatch => {
    dispatch({type: 'USER_BY_ID_LOADING', payload: true});
    const unsubscribe = firestore()
    .collection('users')
    .doc(id)
    .onSnapshot(doc => {
      dispatch(setUserById({...doc.data(), id: doc.id}));
      dispatch({type: 'USER_BY_ID_LOADING', payload: false});
    })
    return () =>unsubscribe();
};