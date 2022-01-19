import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const setListAllPost = data => {
  return {
    type: 'SET_LIST_ALL_POST',
    payload: data,
  };
};
export const getListAllPost = () => dispatch => {
    dispatch({type: 'LIST_ALL_POST_LOADING', payload: true});
     const unsubscribe = firestore().collection('postsUser').orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({id: doc.id,...doc.data()}))
        dispatch(setListAllPost(data));
        dispatch({type: 'LIST_ALL_POST_LOADING', payload: false});
        })
    return () =>unsubscribe();
}