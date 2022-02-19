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
  FlatList,
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
const UploadPost = ({route}) => {
  const {ref} = route.params;
  const navigation = useNavigation();
  const user = useSelector(state => state.user.data);
  const [lockUpPosts, setLockUpPosts] = useState(false);
  const [text, onChangeText] = useState('');
  const [imageUpImp, setImageUpImp] = useState({
    uri: '',
    fileName: '',
  });
  const handleOnPressRemoveImageUpTmp = () => {
    setImageUpImp({
      uri: '',
      fileName: '',
    });
    ImagePicker.clean();
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
    if (text || imageUpImp?.uri) {
      setLockUpPosts(true);
      var url = '';
      if (imageUpImp?.uri) {
        const reference = storage().ref(imageUpImp.fileName);
        await reference.putFile(imageUpImp?.uri);
        url = await storage().ref(imageUpImp.fileName).getDownloadURL();
      }
      ref.add({
        love: [],
        message: {
          text: text,
          image: url,
        },
        uidUser: auth().currentUser.uid,
        createdAt: new Date().getTime(),
        UpDateAt: new Date().getTime(),
        report:[],
      });
      setLockUpPosts(false);
      handleOnPressRemoveImageUpTmp();
      onChangeText('');
      Toast.show({
        text1: 'Bài viết đã được gửi đi',
        visibilityTime: 100,
      });
      navigation.goBack();
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <Icon name="close" size={36} color={'black'} />
          </Pressable>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
              flex: 1,
              paddingHorizontal: 10,
            }}
            numberOfLines={1}>
            Tạo bài viết{' '}
          </Text>
          <Pressable
            style={styles.upPost}
            onPress={() => handleOnUploadPosts()}
            disabled={lockUpPosts}>
            <Text style={styles.textUpPost}>Đăng bài</Text>
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
                    user?.imageAvatar
                }}
              />
            </View>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Bạn đang nghĩ gì ?"
              multiline={true}
            />
          </View>
          {imageUpImp?.uri?.length ? (
            <View style={styles.imageUpImp}>
              <Image source={{uri: imageUpImp?.uri}} style={styles.image} />
              <Pressable
                style={styles.removeImageUpTmp}
                onPress={() => {
                  handleOnPressRemoveImageUpTmp();
                }}>
                <Icon name="close" size={30} color={'white'} />
              </Pressable>
            </View>
          ) : null}
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

export default UploadPost;
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
    color: 'black',
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
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
