import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  ToastAndroid,
  Pressable,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import dateformat from 'dateformat';
import Icon from 'react-native-vector-icons/Ionicons';
const ItemRoomChat = ({item}) => {
  const navigation = useNavigation();
  const [userReceiver, setUserReceiver] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const ref = firestore().collection('users').doc(auth().currentUser.uid)
    .collection('messages_threads').doc(item.id);
  useEffect(() => {
    const sub = firestore()
      .collection('users')
      .doc(item.id)
      .onSnapshot(doc => {
        setUserReceiver({...doc.data()});
      });
    return () => {
      sub();
    };
  }, []);
  const handleOnOpenMessage = () => {
    navigation.navigate('Messages', {uidUserReceiver: item.id});
    if (!item.watched)
      ref
        .update({
          watched: true,
        });
  };
  const handleClickButtonStorage = () => {
      ref
        .update({
          hide: true,
        })
        setModalVisible(false);
  };
  const handleClickButtonDelete = () => {
        ref
        .collection('messages')
        .get().then((querySnapshot) => {
            Promise.all(querySnapshot.docs.map((item) => item.ref.delete()))
            .then(() => {
                ref.delete()
                ToastAndroid.show('Xóa thành công', ToastAndroid.SHORT);
                setModalVisible(false);
            })
        });
  };
  return (
    <>
      <TouchableOpacity
        style={styles.itemMessage}
        onPress={() => {
          handleOnOpenMessage();
        }}
        onLongPress={() => setModalVisible(true)}>
        <Avatar
          source={{
            uri:
              userReceiver.imageAvatar
          }}
          size={50}
          rounded
        />
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                styles.nameFriendMessage,
                !item.watched && styles.textBold,
              ]}
              numberOfLines={1}>
              {userReceiver.displayName}
            </Text>
            <Text style={[styles.textTime, !item.watched && styles.textBold]}>
              •{dateformat(item.lastMessage.createdAt, 'HH:MM')}
            </Text>
          </View>
          <Text
            style={[styles.lastMessage, !item.watched && styles.textBold]}
            numberOfLines={1}>
            {item.user._id == auth().currentUser.uid && 'Bạn: '}
            {item.lastMessage.text}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{flex: 1, backgroundColor: 'black', opacity: 0.2}}></Pressable>
        <View style={styles.morePostContent}>
            <TouchableOpacity
            style={styles.morePostItem}
            onPress={() => handleClickButtonStorage()}>
            <Icon name="file-tray-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>
              Lưu trữ̃ tin nhắn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.morePostItem}
            onPress={() => handleClickButtonDelete()}>
            <Icon name="trash-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>
              Xoá tin nhắn
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default ItemRoomChat;

const styles = StyleSheet.create({
  itemMessage: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  nameFriendMessage: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  lastMessage: {
    marginTop: 4,
    color: 'gray',
    marginRight: 10,
  },
  textTime: {
    color: 'gray',
    paddingHorizontal: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  morePostContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
    paddingVertical: 20,
  },
  morePostItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
