import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Colors from './../../../assets/themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
const ItemGroupLeave = ({item}) => {
  const navigation = useNavigation();
  const handleOnLeaveGroup = () => {
    firestore()
      .collection('groups')
      .doc(item.id)
      .update({
        members: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(item.id)
          .collection('member')
          .doc(auth().currentUser.uid)
          .delete()
          .then(() => {
            ToastAndroid.show('Bạn đã rời khỏi nhóm', ToastAndroid.SHORT);
          });
      })
      .catch(err => {
        ToastAndroid.show('Lỗi', ToastAndroid.SHORT);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <Image
          source={{
            uri:
              item?.imageCover ||
              'https://2.pik.vn/2021c74733ba-47de-4c99-ac6f-d968859e3f3b.png',
          }}
          style={styles.imageCover}
        />
        <View style={styles.descriptionGroup}>
          <Text style={styles.nameGroup} numberOfLines={2}>
            {item?.name || 'Nhóm nào đó '}
          </Text>
          <Text style={styles.nameUserInvite} numberOfLines={1}>
            {'Bạn đã tham gia khi nào đó'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnInvite}
          onPress={() => handleOnLeaveGroup()}>
          <Text style={styles.textBtnInvite}>Rời khỏi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemGroupLeave;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  imageCover: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionGroup: {
    paddingHorizontal: 10,
    flex: 1,
  },
  nameGroup: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameUserInvite: {
    color: 'gray',
    marginTop: 4,
  },
  btnInvite: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },
  textBtnInvite: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});
