import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import dateFormat from 'dateformat';
import ItemComment from './ItemComment';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import {timeSince} from './../../utils/fomattime';
import Loading from "./../../components/Loading";
import Nodata from "./../../components/Nodata";
const Comments = ({route}) => {
  const {dataPost, userItemPost, ref} = route.params;
  const navigation = useNavigation();
  const [textComment, setTextComment] = useState('');
  const [imageComment, setImageComment] = useState({
    uri: '',
    fileName: '',
  });
  const [lockUpComment, setLockUpComment] = useState(false);
  const [listComments, setListComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  useEffect(() => {
    setLoading(true);
    const sub = ref.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      setListComments(
        querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})),
        setLoading(false)
      );
    });
    return () => {
      sub();
    };
  }, []);
  const handleSendComment = async () => {
    setLockUpComment(true);
    let uriImageComment = '';
    if (imageComment.uri) {
      const reference = storage().ref(imageComment.fileName);
      await reference.putFile(imageComment?.uri);
      uriImageComment = await storage()
        .ref(imageComment.fileName)
        .getDownloadURL();
    }
    ref
      .add({
        love: [],
        textComment,
        imageComment: uriImageComment,
        uidUserComment: auth().currentUser.uid,
        createdAt: new Date().getTime(),
        idPost: dataPost.id,
      })
      .then(() => {
        if (auth().currentUser.uid !== dataPost.uidUser)
          firestore()
            .collection('users')
            .doc(dataPost.uidUser)
            .collection('notifications')
            .doc(`Comment${dataPost.id}`)
            .set(
              {
                createdAt: new Date().getTime(),
                type: 'Comment',
                idPost: dataPost.id,
                listUsers: firestore.FieldValue.arrayUnion(
                  auth().currentUser.uid,
                ),
                watched: false,
              },
              {merge: true},
            );
      });
    setTextComment('');
    handleOnPressRemoveImageComment();
    setLockUpComment(false);
  };

  const openLibrary = () => {
    ImagePicker.openPicker({mediaType: 'photo'}).then(image => {
      setImageComment({uri: image.path, fileName: image.modificationDate});
    }).catch(err => {
    });
  };
  const openCamera = () => {
    ImagePicker.openCamera({mediaType: 'photo'}).then(image => {
      setImageComment({uri: image.path, fileName: image.modificationDate});
    }).catch(err => {
    });
  };
  const handleOnPressRemoveImageComment = () => {
    setImageComment({
      uri: '',
      fileName: '',
    });
    ImagePicker.clean();
  };
  return (
    <>
      <View style={styles.commentsContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
        </View>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {dataPost?.message.text.length > 0 && (
            <View style={styles.textPostUser}>
              <Avatar
                size={34}
                rounded
                source={{
                  uri:
                    userItemPost?.imageAvatar
                }}
              />
              <View style={styles.title}>
                <Text style={styles.name}>
                  {userItemPost?.displayName || 'Người dùng '}
                </Text>
                <Text style={styles.lastTime}>
                  {timeSince(dataPost?.createdAt)}
                </Text>
                <Text style={styles.textContent}>{dataPost?.message.text}</Text>
              </View>
            </View>
          )}
          {loading? <Loading /> :(listComments.length > 0 ? (
            <>
              {listComments.map((item, index) => (
                <ItemComment item={item} key={item.id} refItem={ref} />
              ))}
            </>
          ):<Nodata title="Không có bình luận nào" />)}
        </ScrollView>
        <View style={styles.inputTextComment}>
          {!imageComment?.uri && (
            <View style={styles.choiceImage}>
              <TouchableOpacity
                style={styles.itemChoice}
                onPress={() => openCamera()}>
                <Icon name="camera-outline" size={24} color={'black'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.itemChoice}
                onPress={() => openLibrary()}>
                <Icon name="image-outline" size={24} color={'black'} />
              </TouchableOpacity>
            </View>
          )}
          <View style={{flex: 1}}>
            {imageComment?.uri?.length ? (
              <View style={styles.imageComment}>
                <Image source={{uri: imageComment?.uri}} style={styles.image} />
                <Pressable
                  style={styles.removeImageComment}
                  onPress={() => {
                    handleOnPressRemoveImageComment();
                  }}>
                  <Icon name="close" size={20} color={'white'} />
                </Pressable>
              </View>
            ) : null}
            <TextInput
              style={styles.inputText}
              value={textComment}
              multiline
              onChangeText={setTextComment}
              placeholder={'Viết bình luận'}
            />
          </View>
          {!textComment.trim().length && !imageComment?.uri?.length ? null : (
            <TouchableOpacity
              onPress={() => handleSendComment()}
              style={styles.send}>
              <Text style={[styles.textSend]}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Modal transparent={true} visible={lockUpComment}>
        <View style={styles.model}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </>
  );
};

export default Comments;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  commentsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    backgroundColor: 'white',
  },
  headerTitle: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    marginBottom: 20,
  },
  textPostUser: {
    flexDirection: 'row',
    padding: 10,
    marginLeft: 5,
    marginBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    backgroundColor: 'white',
  },
  title: {
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  lastTime: {
    fontSize: 12,
  },
  textContent: {
    marginVertical: 10,
    fontSize: 16,
  },
  inputTextComment: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderTopWidth: 0.3,
    borderTopColor: '#d1d1d1',
    backgroundColor: 'white',
  },
  inputText: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  send: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginRight: 10,
  },
  textSend: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00a6ff',
  },
  choiceImage: {
    flexDirection: 'row',
  },
  itemChoice: {
    marginRight: 4,
    justifyContent: 'center',
  },
  imageComment: {
    marginLeft: 10,
    marginTop: 10,
  },
  image: {
    borderRadius: 5,
    width: height / 4,
    height: height / 8,
  },
  removeImageComment: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  model: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
