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
  ToastAndroid
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
import { timeSince } from "./../../utils/fomattime";
const ItemPostGroups = ({item}) => {
  const navigation = useNavigation();
  const userNow = useSelector(state => state.user.data)
  const [userItemPost, setUserItemPost] = useState({});
  const [totalComment, setTotalComment] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataGroupPost, setDataGroupPost] = useState({});
  const [dataPost, setDataPost] = useState(item);
  const ref = firestore()
    .collection('groups')
    .doc(item.idGroup)
    .collection('posts')
    .doc(item.id);
  useEffect(() => {
      const sub5 = ref.collection('comments').onSnapshot(querySnapshot => {
        setTotalComment(querySnapshot.size);
      });
    const sub = firestore()
      .collection('groups')
      .doc(item.idGroup)
      .onSnapshot(doc => {
        setDataGroupPost(doc.data());
      });
    const sub2 = firestore()
      .collection('users')
      .doc(item.uidUser)
      .onSnapshot(doc => {
        setUserItemPost(doc.data());
      });
    const sub4 = ref.onSnapshot(doc => {
      if (doc?.exists) {
        setDataPost({...doc.data(), id: doc?.id});
      } else {
        setDataPost(null);
      }
    });
    return () => {
    sub5();
      sub();
      sub2();
      sub4();
    };
  }, []);
  const handleOnLove = () => {
    const checkLove = dataPost?.love.indexOf(userNow.uid);
    if (checkLove > -1) {
      var newArr = [...dataPost.love];
      newArr.splice(checkLove, 1);
      ref.update({
        love: [...newArr],
      });
    } else {
      ref.update({
        love: [userNow.uid, ...dataPost.love],
      });
    }
  };
  const handleClickButtonUpDatePost = () => {
    setModalVisible(false);
    navigation.navigate('UpDatePost', {dataPost: dataPost, ref: ref});
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
    const handleOpenComments = () => {
    navigation.navigate('Comments', {
      dataPost: item,
      userItemPost: userItemPost,
      ref: ref.collection('comments'),
    });
  };
  const deletePost = () => {
    ref.collection('comments').get().then(querySnapshot => {
      Promise.all(querySnapshot.docs.map((item) => item.ref.delete()))
        .then(() => {
          ref.delete().then(() => {
            setModalVisible(false);
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
  }
  const reportPost = () => {
        ref.set(
        {
            report: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        },
        {merge: true},
        ).then(() => {
        setModalVisible(false);
        ToastAndroid.show('Bạn đã báo cáo bài viết thành công', ToastAndroid.SHORT);
        });
  }
  if (!dataPost) return null;
  return (
    <>
      <View style={styles.itemPost}>
        <View style={styles.headerItemPost}>
          <Avatar
            size={50}
            rounded
            source={{
              uri:
                dataGroupPost?.imageCover ||
                'https://images6.alphacoders.com/102/1029037.jpg',
            }}>
            <Avatar
              size={25}
              rounded
              containerStyle={{position: 'absolute', bottom: 0, right: -6}}
              source={{
                uri:
                  userItemPost?.imageAvatar 
                  || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              }}
            />
          </Avatar>
          <View style={styles.title}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('StackGroups', {
                  screen: 'DetailGroup',
                  params: {id: item.idGroup},
                });
              }}>
              <Text style={styles.name} numberOfLines={2}>
                {dataGroupPost?.name}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileUser', {
                    uidUser: dataPost?.uidUser,
                  });
                }}>
                <Text style={{marginRight: 6}}>
                  {userItemPost?.displayName}
                </Text>
              </TouchableOpacity>
              <Text style={styles.lastTime}>
                {timeSince(item?.createdAt)}
              </Text>
            </View>
          </View>
            <Pressable
              style={styles.morePost}
              onPress={() => setModalVisible(true)}>
              <Icon name="ellipsis-horizontal" size={24} color="black" />
            </Pressable>
        </View>
        <View style={styles.content}>
          {dataPost?.message?.text.length > 0 && (
            <Text
              style={[
                styles.textContent,
                !dataPost?.message.image && {fontSize: 20},
              ]}>
              {dataPost?.message.text}
            </Text>
          )}
          {dataPost?.message?.image.length > 0 ? (
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
              <Image
                source={{
                  uri:
                    dataPost?.message.image ||
                    'https://cdn.presslabs.com/wp-content/uploads/2018/10/upload-error.png',
                }}
                style={styles.image}
              />
            </Lightbox>
          ) : null}
        </View>
        <View style={styles.react}>
          <TouchableOpacity
            style={styles.itemIcon}
            onPress={() => handleOnLove()}>
            <Icon
              name={
                dataPost.love.indexOf(userNow.uid) > -1 ? 'heart' : 'heart-outline'
              }
              size={22}
              color={dataPost.love.indexOf(userNow.uid) > -1 ? 'red' : '#666'}
            />
            {item.love.length > 0 && (
              <Text style={styles.textItemReact}>{dataPost.love.length}</Text>
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
      <Modal
        transparent={true}
        visible={modalVisible}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{flex: 1, backgroundColor: 'black', opacity: 0.2}}></Pressable>
        <View style={styles.morePostContent}>
        {item?.uidUser === auth().currentUser.uid ?
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
          </>:
          <TouchableOpacity
            style={styles.morePostItem}
            onPress={() => handleClickButtonReport()}>
            <Icon name="information-circle-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>Báo cáo bài viết</Text>
          </TouchableOpacity>}
        </View>
      </Modal>
    </>
  );
};

export default ItemPostGroups;

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