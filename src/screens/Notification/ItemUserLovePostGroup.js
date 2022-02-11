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
const ItemUserLovePostGroup = ({item,handleClickButtonDelete}) => {
  const [user, setUser] = React.useState({});
  const [nameGroup, setNameGroup] = React.useState('');
  const navigation = useNavigation();
  const [initializing, setInitializing] = useState(true);
    const [modalVisible, setModalVisible] = useState(false)
  useEffect(() => {
    firestore()
      .collection('users')
      .doc(item?.listUsers[item?.listUsers.length - 1])
      .get()
      .then(doc => {
        setUser(doc.data());
        if(initializing) setInitializing(false)
      });
  }, [item]);
  useEffect(() => {
    firestore()
      .collection('groups')
      .doc(item.idGroup)
      .get()
      .then(doc => {
        setNameGroup(doc.data().name);
      });
  }, []);
  const handleOnWatch =()=>{  
    navigation.navigate('PostDetailGroup', {
                    data: item,
                  });
    firestore().collection('users').doc(auth().currentUser.uid).collection('notifications')
        .doc(item.id).update({
            watched: true
        })
  }
  if(initializing) return <Loading/>;
  return (
      <>
    <TouchableOpacity style={[styles.itemUserFollow,!item.watched?styles.unread:null]}
        onPress={() => {
            handleOnWatch();
        }}
    >
      <View style={styles.body}>
        <View style={{alignSelf: 'flex-start'}}>
          <Image
            source={{
              uri:
                user?.imageAvatar
            }}
            style={styles.imageAvatar}
          />
          <View style={{position: 'absolute', bottom: 0, right: -4}}>
            <Icon2 name="user" size={24} color={'gray'} />
          </View>
        </View>
        <View style={styles.content}>
            <Text style={styles.title}>
                {user?.displayName || 'Ai đó '} {item?.listUsers.length > 1 && `và ${item?.listUsers.length - 1} người khác`}
                <Text style={{fontWeight: '600', color: 'gray'}}>
                    {' '}đã yêu thích bài viết của bạn trong{' '}
                </Text>
                {nameGroup}
            </Text>
            <Text style={styles.time}>{timeSince(item?.createdAt)}</Text>
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

export default ItemUserLovePostGroup;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  itemUserFollow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unread: {
    backgroundColor: '#e7f3ff',
  },
  imageAvatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  body: {
      flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft:10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    paddingRight: 10,
    fontWeight: 'bold',
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
