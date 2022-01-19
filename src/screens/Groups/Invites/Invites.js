import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from './../../../assets/themes/Colors';
import Header from './Header';
import ItemYourInvites from './ItemYourInvites';
import ItemInviteFriends from './ItemInviteFriends';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
const Invites = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [listInviteGroups, setListInviteGroups] = useState([]);
  useEffect(() => {
    const sub = firestore()
      .collection('groups')
      .where('members', 'array-contains', auth().currentUser.uid)
      .onSnapshot(querySnapshot => {
        setMyGroups(
          querySnapshot.docs.map(item => ({...item.data(), id: item.id})),
        );
      });
    const sub2 = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('inviteGroup')
      .onSnapshot(querySnapshot => {
        setListInviteGroups(
          querySnapshot.docs.map(item => ({...item.data(), id: item.id})),
        );
      });
    return () => {
      sub();
      sub2();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {listInviteGroups.length > 0 &&<View style={styles.yourInvites}>
          <Text style={styles.headerYourInvites}>Lời mời tham gia nhóm</Text>
          <View style={styles.listYourInvites}>
            {listInviteGroups.map((item, index) => 
                <ItemYourInvites key={item.id} item={item} />)}
          </View>
        </View>}
        <View style={styles.yourInvites}>
          <Text style={styles.headerYourInvites}>Mời bạn bè tham gia nhóm</Text>
          <View style={styles.listYourInvites}>
            {myGroups.map(item => (
                <ItemInviteFriends key={item.id} item={item} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Invites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  yourInvites: {
    paddingVertical: 20,
    borderBottomWidth: 0.4,
    borderBottomColor: '#e3e3e3',
  },
  headerYourInvites: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
