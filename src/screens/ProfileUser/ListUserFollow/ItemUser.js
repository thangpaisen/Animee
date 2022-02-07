import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Colors from './../../../assets/themes/Colors';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
const ItemUser = ({uid}) => {
  const navigation = useNavigation();
  const [user, setUser] = React.useState({});
  const [isFollow, setIsFollow] = useState(false);
  useEffect(() => {
    const sub = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(doc => {
        setUser({...doc.data(), id: doc.id});
      });
    const sub2 = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(doc => {
        setIsFollow(doc.data().follow.includes(uid));
      });
    return () => {
      sub2();
      sub();
    };
  }, []);
  const handleOnFollow = () => {
    if (!isFollow)
      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          follow: firestore.FieldValue.arrayUnion(user.id),
        })
        .then(() => {
          firestore()
            .collection('users')
            .doc(user.id)
            .update({
              follower: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
            })
            .then(() => {
              handleAddNotificationUser();
            });
        });
    else
      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          follow: firestore.FieldValue.arrayRemove(user.id),
        })
        .then(() => {
          firestore()
            .collection('users')
            .doc(user.id)
            .update({
              follower: firestore.FieldValue.arrayRemove(
                auth().currentUser.uid,
              ),
            });
        });
  };
  const handleAddNotificationUser = () => {
    console.log('add notification');
    firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .doc(`Follower${auth().currentUser.uid}`)
      .set({
        type: 'Follower',
        idUserFollow: auth().currentUser.uid,
        createdAt: new Date().getTime(),
        watched: false,
      });
  };
  return (
    <TouchableOpacity
      style={styles.itemUser}
      onPress={() => {
        navigation.push('ProfileUser', {uidUser: user.uid});
      }}>
      <Avatar
        source={{
          uri: user.imageAvatar,
        }}
        size={45}
        rounded
        containerStyle={{}}
      />
      <View style={{marginLeft: 10, flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}} numberOfLines={1}>
          {user?.displayName || 'Người dùng ... '}
        </Text>
        <Text style={{fontSize: 14}} numberOfLines={1}>
          {user.email}
        </Text>
      </View>
      {auth().currentUser.uid !== user.id && (
        <Pressable
          style={[
            styles.btnFollowUser,
            isFollow ? styles.btnFollowUserActive : null,
          ]}
          onPress={() => {
            handleOnFollow();
          }}
          // disabled={isFollow}
        >
          <Text style={{color: '#fff'}}>
            {!isFollow ? 'Theo đõi' : 'Dang theo đõi'}
          </Text>
        </Pressable>
      )}
    </TouchableOpacity>
  );
};

export default ItemUser;

const styles = StyleSheet.create({
  itemUser: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnFollowUser: {
    marginRight: 40,
    backgroundColor: '#00a680',
    backgroundColor: Colors.primary,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  btnFollowUserActive: {
    backgroundColor: '#999',
  },
});
