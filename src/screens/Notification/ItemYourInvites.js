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
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Colors from './../../assets/themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import { timeSince } from "./../../utils/fomattime";
import Loading from "./../../components/Loading";
const ItemYourInvites = ({item,handleClickButtonDelete}) => {
    const navigation = useNavigation();
    const [group, setGroup] = React.useState({});
    const [user, setUser] = React.useState({});
    const [initializing, setInitializing] = useState(true);
    const [modalVisible, setModalVisible] = useState(false)
  useEffect(() => {
    Promise.all([
      firestore()
      .collection('users')
      .doc(item?.idUserInvite)
      .get()
      .then(doc => {
        setUser(doc.data());
      }),
      firestore()
      .collection('groups')
      .doc(item?.idGroup)
      .get()
      .then(doc => {
        setGroup(doc.data());
      })
    ]).then(() => {
      if(initializing) setInitializing(false)
    })
  }, []);
  const handleOnJoin = () => {
    if (!group?.members.includes(auth().currentUser.uid)) {
      firestore()
        .collection('groups')
        .doc(item?.idGroup)
        .update({
          members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        });
      firestore()
        .collection('groups')
        .doc(item?.idGroup)
        .collection('member')
        .doc(auth().currentUser.uid)
        .set({
          uid: auth().currentUser.uid,
          role: 'member',
          createdAt: new Date().getTime(),
        });
        ToastAndroid.show('Bạn Đã tham gia nhóm', ToastAndroid.SHORT);
    }
    else ToastAndroid.show('Bạn Đã tham gia nhóm này ', ToastAndroid.SHORT);
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('notifications')
      .doc(item?.id)
      .delete();
  };
  const handleOnRemove = () => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('notifications')
      .doc(item?.id)
      .delete();
    ToastAndroid.show('Đã xoá', ToastAndroid.SHORT);
  };
  const handleOnWatch = () => {
      navigation.navigate('StackGroups', {screen: 'Invites'})
      firestore().collection('users').doc(auth().currentUser.uid).collection('notifications')
        .doc(item.id).update({
            watched: true
        })
  };
  if(initializing) return <Loading/>;
  return (
      <>
    <TouchableOpacity style={[styles.itemYourInvites,!item.watched?styles.unread:null]}
    onPress={() => {
            handleOnWatch();
        }}
    >
      <View style={styles.group}>
        <View style={{alignSelf: 'flex-start'}}>
          <Image
            source={{
              uri:
                user?.imageAvatar
            }}
            style={styles.imageAvatar}
          />
          <View style={{position: 'absolute', bottom: 0, right: -4}}>
            <Icon2 name="users" size={24} color={'gray'} />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            flex: 1,
          }}>
          <View style={styles.descriptionGroup}>
            <Text style={styles.nameGroup}>
              {user?.displayName || 'Ai đó '}
              <Text style={{fontWeight: '600', color: 'gray'}}>
                 {' '}đã mời bạn tham gia nhóm{' '}
              </Text>
              {group?.name || 'nào đó'}
            </Text>
          </View>
          <Text style={styles.time}>{timeSince(item?.createdAt)}</Text>
          <View style={styles.btnChoice}>
            <TouchableOpacity
              style={styles.itemBtnChoice}
              onPress={() => handleOnJoin()}>
              <Text style={styles.textBtnChoice}>Tham gia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemBtnChoice, {backgroundColor: Colors.border}]}
              onPress={() => handleOnRemove()}>
              <Text style={[styles.textBtnChoice, {color: 'black'}]}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.btnChoice}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="ellipsis-horizontal" size={24} color={'black'} />
      </TouchableOpacity>
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
            onPress={() => handleClickButtonDelete(item.id)}>
            <Icon name="trash-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>
              Gỡ thông báo này
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default ItemYourInvites;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  itemYourInvites: {
    // marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  unread: {
    backgroundColor: '#e7f3ff',
  },
  imageAvatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  group: {
    flexDirection: 'row',
    flex:1,
  },
  descriptionGroup: {},
  nameGroup: {
    fontSize: 16,
    lineHeight: 20,
    paddingRight: 10,
    fontWeight: 'bold',
  },
  nameUserInvite: {
    color: 'gray',
    marginTop: 4,
  },
  btnChoice: {
    marginTop: 6,
    flexDirection: 'row',
  },
  itemBtnChoice: {
    marginRight: 10,
    paddingHorizontal: 30,
    paddingVertical: 6,
    backgroundColor: '#158dcf',
    borderRadius: 10,
  },
  textBtnChoice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  time:{
    color: 'gray'
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
