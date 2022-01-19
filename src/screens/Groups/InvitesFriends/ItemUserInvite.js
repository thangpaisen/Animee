import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Colors from './../../../assets/themes/Colors';
const ItemUserInvite = ({idUser, idGroup}) => {
  const [isInvite, setIsInvite] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    firestore()
      .collection('users')
      .doc(idUser)
      .get()
      .then(doc => {
        setUser({...doc.data(), id: doc.id});
      });
  }, []);
  const handleOnInvite = () => {
    setIsInvite(true);
    firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .doc(`inviteGroup${auth().currentUser.uid}${idGroup}`)
      .set({
        type: 'inviteGroup',
        idGroup: idGroup,
        idUserInvite: auth().currentUser.uid,
        createdAt: new Date().getTime(),
        watched: false
      })
      .then(() => {
      });
    firestore()
      .collection('users')
      .doc(user.id)
      .collection('inviteGroup')
      .doc(`inviteGroup${auth().currentUser.uid}${idGroup}`)
      .set({
        idGroup: idGroup,
        idUserInvite: auth().currentUser.uid,
        createdAt: new Date().getTime(),
      })
      .then(() => {
      });
  };
  return (
    <View style={styles.container}>
      <Image source={{uri: user?.imageAvatar}} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {user?.displayName}
      </Text>
      <TouchableOpacity
        style={[styles.btnAdd, isInvite && styles.btnAddActive]}
        onPress={() => handleOnInvite()}
        disabled={isInvite ? true : false}>
        <Text style={styles.textAdd}>{isInvite ? 'Đã mời' : 'Mời'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemUserInvite;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 46,
  },
  name: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  btnAdd: {
    backgroundColor: '#158dcf',
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 12,
  },
  btnAddActive: {
    backgroundColor: Colors.border,
  },
  textAdd: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
