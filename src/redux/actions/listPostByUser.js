import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const setListPostByUser = data => {
  return {
    type: 'SET_LIST_POST_BY_USER',
    payload: data,
  };
};
export const getListPostByUser = (id) => dispatch => {
    dispatch({type: 'LIST_POST_BY_USER_LOADING', payload: true});
     const unsubscribe = firestore().collection('postsUser').where('uidUser', '==', id)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        dispatch(setListPostByUser(data.sort((a, b) => b.createdAt - a.createdAt)))
        dispatch({type: 'LIST_POST_BY_USER_LOADING', payload: false});
        })
    return () =>unsubscribe();
}