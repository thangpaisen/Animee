import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  ToastAndroid,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Avatar} from 'react-native-elements';
import Lightbox from 'react-native-lightbox-v2';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import dateFormat from 'dateformat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import Colors from './../../assets/themes/Colors';
import {timeSince} from './../../utils/fomattime';
const ItemPost = ({item}) => {
  const navigation = useNavigation();
  const userNow = useSelector(state => state.user.data);
  const [userItemPost, setUserItemPost] = useState({});
  const [totalComment, setTotalComment] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const ref = firestore().collection('postsUser').doc(item.id);
  useEffect(() => {
    const sub = ref.collection('comments').onSnapshot(querySnapshot => {
      setTotalComment(querySnapshot.size);
    });
    return () => {
      sub();
    };
  }, []);
  useEffect(() => {
    const sub = firestore()
      .collection('users')
      .doc(item.uidUser)
      .onSnapshot(doc => {
        setUserItemPost({
          id: doc.id,
          ...doc.data(),
        });
      });
    return () => sub();
  }, [item?.uidUser]);
  const handleOnLove = () => {
    if (item?.love.indexOf(userNow.uid) > -1) {
      ref.set(
        {
          love: firestore.FieldValue.arrayRemove(userNow.uid),
        },
        {merge: true},
      );
    } else {
      ref.set(
        {
          love: firestore.FieldValue.arrayUnion(userNow.uid),
        },
        {merge: true},
      );
      if (auth().currentUser.uid !== item.uidUser)
        firestore()
          .collection('users')
          .doc(item.uidUser)
          .collection('notifications')
          .doc(`Love${item.id}`)
          .set(
            {
              createdAt: new Date().getTime(),
              listUsers: firestore.FieldValue.arrayUnion(userNow.uid),
              type: 'Love',
              idPost: item.id,
              watched: false,
            },
            {merge: true},
          );
    }
  };
  const handleOpenComments = () => {
    // lastInputRef.current.focus();
  };
  const handleClickButtonDeletePost = () => {
    Alert.alert('Thông báo', 'Bạn muốn xóa bài viết', [
      {
        text: 'Cancel',
        onPress: () => setModalVisible(false),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deletePost()},
    ]);
  };
  const handleClickButtonUpDatePost = () => {
    setModalVisible(false);
    navigation.navigate('UpDatePost', {dataPost: item, ref: ref});
  };
  const deletePost = () => {
    ref.collection('comments').get().then(querySnapshot => {
      Promise.all(querySnapshot.docs.map((item) => item.ref.delete()))
        .then(() => {
          ref.delete().then(() => {
            setModalVisible(false);
            navigation.goBack();
            ToastAndroid.show('Xóa bài viết thành công', ToastAndroid.SHORT);
          });
        })
    });
  };
  const handleClickButtonReport = () => {
    Alert.alert('Thông báo', 'Bạn muốn báo cáo bài viết', [
      {
        text: 'Cancel',
        onPress: () => setModalVisible(false),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => reportPost()},
    ]);
  };
  const reportPost = () => {
    ref
      .set(
        {
          report: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        },
        {merge: true},
      )
      .then(() => {
        setModalVisible(false);
        ToastAndroid.show(
          'Bạn đã báo cáo bài viết thành công',
          ToastAndroid.SHORT,
        );
      });
  };
  return (
    <>
      <View style={styles.itemPost}>
        <View style={styles.headerItemPost}>
          <Avatar
            size={34}
            rounded
            source={{
              uri:
                userItemPost?.imageAvatar
            }}
          />
          <View style={styles.title}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileUser', {uidUser: item.uidUser});
              }}>
              <Text style={styles.name}>{userItemPost.displayName}</Text>
            </TouchableOpacity>
            <Text style={styles.lastTime}>{timeSince(item?.createdAt)}</Text>
          </View>
          <Pressable
            style={styles.morePost}
            onPress={() => setModalVisible(true)}>
            <Icon name="ellipsis-horizontal" size={24} color="black" />
          </Pressable>
        </View>
        <View style={styles.content}>
          {item?.message?.text.length > 0 && (
            <Text
              style={[
                styles.textContent,
                !item?.message?.image && {fontSize: 20},
              ]}>
              {item.message.text}
            </Text>
          )}
          {item?.message?.image ? (
            <Lightbox
              navigator={navigation.navigator}
              activeProps={{
                style: {
                  flex: 1,
                  width: width,
                  height: height,
                  resizeMode: 'contain',
                },
              }}>
              <Image source={{uri: item?.message.image}} style={styles.image} />
            </Lightbox>
          ) : null}
        </View>
        <View style={styles.react}>
          <TouchableOpacity
            style={styles.itemIcon}
            onPress={() => handleOnLove()}>
            <Icon
              name={
                item?.love?.indexOf(userNow.uid) > -1
                  ? 'heart'
                  : 'heart-outline'
              }
              size={22}
              color={item?.love?.indexOf(userNow.uid) > -1 ? 'red' : '#666'}
            />
            {item?.love?.length > 0 && (
              <Text style={styles.textItemReact}>{item?.love?.length}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemIcon}
            onPress={() => handleOpenComments()}>
            <Icon name="chatbox-outline" size={22} color={'#666'} />
            {totalComment > 0 && (
              <Text style={styles.textItemReact}>{totalComment}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemIcon}>
            <Icon name="share-social-outline" size={22} color={'#666'} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal transparent={true} visible={modalVisible}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{flex: 1, backgroundColor: 'black', opacity: 0.2}}></Pressable>
        <View style={styles.morePostContent}>
          {item?.uidUser === auth().currentUser.uid ? (
            <>
              <TouchableOpacity
                style={styles.morePostItem}
                onPress={() => handleClickButtonUpDatePost()}>
                <Icon name="eyedrop-outline" size={24} color="black" />
                <Text style={{fontSize: 16, marginLeft: 10}}>
                  Chỉnh sửa bài viết
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.morePostItem}
                onPress={() => handleClickButtonDeletePost()}>
                <Icon name="trash-outline" size={24} color="black" />
                <Text style={{fontSize: 16, marginLeft: 10}}>Xóa</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.morePostItem}
              onPress={() => handleClickButtonReport()}>
              <Icon name="information-circle-outline" size={24} color="black" />
              <Text style={{fontSize: 16, marginLeft: 10}}>
                Báo cáo bài viết
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </>
  );
};

export default ItemPost;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  itemPost: {
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 6,
    borderBottomColor: '#e3e3e3',
  },
  headerItemPost: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  lastTime: {
    fontSize: 12,
  },
  morePost: {},
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
  content: {
    marginVertical: 10,
  },
  textContent: {
    padding: 10,
    fontSize: 16,
  },
  image: {
    width: width,
    height: height / 2,
  },
  react: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemIcon: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    paddingVertical: 4,
    justifyContent: 'center',
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
  },
  textItemReact: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
});
