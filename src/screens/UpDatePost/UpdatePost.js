import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from "react-redux";

const UpDatePost = ({route}) => {
  const {dataPost, ref} = route.params;
  const navigation = useNavigation();
    const user = useSelector(state => state.user.data);
  const [lockUpPosts, setLockUpPosts] = useState(false);
  const [text, onChangeText] = useState(dataPost.message.text);
  const [imageUpImp, setImageUpImp] = useState({
    uri: dataPost.message.image,
    fileName: '',
  });
  const handleOnPressRemoveImageUpTmp = () => {
    if (imageUpImp.uri.length > 0 && !imageUpImp.uri.includes('firebase'))
        ImagePicker.clean()
    setImageUpImp({
        uri: '',
        fileName:''
    });
  };
  const openLibrary = () => {
    ImagePicker.openPicker({mediaType: 'photo'}).then(image => {
      setImageUpImp({uri: image.path, fileName: image.modificationDate});
    }).catch(error => {
      });
  };
  const openCamera = () => {
    ImagePicker.openCamera({mediaType: 'photo'}).then(image => {
      setImageUpImp({uri: image.path, fileName: image.modificationDate});
    }).catch(error => {
      });
  };
  const handleOnUploadPosts = async () => {
    if (text || imageUpImp.uri) {
      setLockUpPosts(true);
      let uri = imageUpImp.uri;
      if(imageUpImp.uri.length > 0 && !imageUpImp.uri.includes('firebase')){
          const reference = storage().ref(imageUpImp.fileName);
            await reference.putFile(imageUpImp.uri);
            uri = await storage().ref(imageUpImp.fileName).getDownloadURL();
      }
      ref
        .update({
          message: {
            text: text,
            image: uri,
          },
          UpDateAt: new Date().getTime(),
        })
        .then(() => {
          setLockUpPosts(false);
          handleOnPressRemoveImageUpTmp();
          onChangeText('');
          Toast.show({
            text1: 'Bài viết đã được Cập nhật',
            visibilityTime: 100,
          });
          navigation.goBack();
        });
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="close" size={36} color={'black'} />
          </Pressable>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1,
              paddingHorizontal: 10,
            }}
            numberOfLines={1}>
            Cập nhật bài viết{' '}
          </Text>
          <Pressable
            style={styles.upPost}
            onPress={() => handleOnUploadPosts()}
            disabled={lockUpPosts}>
            <Text style={styles.textUpPost}>Lưu</Text>
          </Pressable>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.avatar}>
              <Avatar
                size={36}
                rounded
                source={{
                  uri:
                    user.imageAvatar
                }}
              />
            </View>
            <TextInput
              autoFocus
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Bạn đang nghĩ gì ?"
              multiline={true}
            />
          </View>
          {imageUpImp?.uri.length != 0 && (
            <View style={styles.imageUpImp}>
              <Image source={{uri: imageUpImp.uri}} style={[styles.image]} />
              <Pressable
                style={styles.removeImageUpTmp}
                onPress={() => {
                  handleOnPressRemoveImageUpTmp();
                }}>
                <Icon name="close" size={30} color={'white'} />
              </Pressable>
            </View>
          )}
        </ScrollView>
        <View style={styles.choiceImage}>
          <TouchableOpacity
            style={styles.itemChoice}
            onPress={() => openCamera()}>
            <Icon name="camera-outline" size={30} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemChoice}
            onPress={() => openLibrary()}>
            <Icon name="image-outline" size={30} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={lockUpPosts}>
        <View style={styles.model}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </>
  );
};

export default UpDatePost;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upPost: {
    backgroundColor: '#00a6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  textUpPost: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {},
  input: {
    flex: 1,

    fontSize: 18,
    lineHeight: 23,
    paddingTop: 4,

    marginHorizontal: 10,
  },
  choiceImage: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopColor: '#00a6ff',
    borderTopWidth: 0.3,
  },
  itemChoice: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  imageUpImp: {
    marginHorizontal: 10,
  },
  image: {
    borderRadius: 5,
    width: width - 20,
    height: height / 2,
  },
  removeImageUpTmp: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 36,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  model: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
