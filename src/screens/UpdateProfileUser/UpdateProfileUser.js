import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Header from './Header';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import { useSelector,useDispatch } from "react-redux";
import { getUser } from "./../../redux/actions/user";
const UpdateProfileUser = ({route}) => {
    const {user} = route.params;
  const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setTextName] = useState('');
  const dispatch = useDispatch()
  const [typeImage, setTypeImage] = useState('');
  const [profileUser, setProfileUser] = useState({
      displayName: user?.displayName,
      description: user?.description,
      imageAvatar: {
        fileName: '',
        uri: user?.imageAvatar,
      },
      imageCover: {
        fileName: '',
        uri: user?.imageCover,
      },
    });
  const handleOnSave = async () => {
    if (
      user.displayName !== profileUser.displayName ||
      user.description !== profileUser.description ||
      user.imageAvatar !== profileUser.imageAvatar.uri ||
      user.imageCover !== profileUser.imageCover.uri
    ) {
      setLoading(true);
      var uriImageAvatar = profileUser.imageAvatar.uri;
      var uriImageCover = profileUser.imageCover.uri;
      if (
        !uriImageAvatar.includes('firebase') &&
        profileUser.imageAvatar.fileName !== ''
      ) {
        const reference = storage().ref(profileUser.imageAvatar.fileName);
        await reference.putFile(uriImageAvatar);
        uriImageAvatar = await storage()
          .ref(profileUser.imageAvatar.fileName)
          .getDownloadURL();
      }
      if (
        !uriImageCover.includes('firebase') &&
        profileUser.imageCover.fileName !== ''
      ) {
        const reference = storage().ref(profileUser.imageCover.fileName);
        await reference.putFile(uriImageCover);
        uriImageCover = await storage()
          .ref(profileUser.imageCover.fileName)
          .getDownloadURL();
      }
      firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          displayName: profileUser.displayName,
          description: profileUser.description,
          imageAvatar: uriImageAvatar,
          imageCover: uriImageCover,
        })
        .then(() => {
          setLoading(false);
          Toast.show({
            text1: 'Hồ sơ đã được Cập nhật',
            visibilityTime: 100,
          });
          ImagePicker.clean();
          navigation.goBack();
        });
    }
  };
  const openLibrary = () => {
    ImagePicker.openPicker({mediaType: 'photo'}).then(image => {
      if (typeImage === 'avatar') {
            setProfileUser({
              ...profileUser,
              imageAvatar: {
                fileName: image.modificationDate,
                uri: image.path,
              },
            });
          }
      if (typeImage === 'cover') {
            setProfileUser({
              ...profileUser,
              imageCover: {
                fileName: image.modificationDate,
                uri: image.path,
              },
            });
          }
      setModalVisible(false);  
    }).catch(error => {
    });
  };
  const openCamera = () => {
    ImagePicker.openCamera({mediaType: 'photo'}).then(image => {
      if (typeImage === 'avatar') {
            setProfileUser({
              ...profileUser,
              imageAvatar: {
                fileName: image.modificationDate,
                uri: image.path,
              },
            });
          }
      if (typeImage === 'cover') {
            setProfileUser({
              ...profileUser,
              imageCover: {
                fileName: image.modificationDate,
                uri: image.path,
              },
            });
          }
      setModalVisible(false);  
    }).catch(error => {
    });
  };
  return (
    <>
      <View style={styles.container}>
        <Header handleOnSave={handleOnSave} />
        <Pressable
          onPress={() => {
            setModalVisible(true);
            setTypeImage('cover');
          }}>
          <ImageBackground
            source={{
              uri:
                profileUser?.imageCover?.uri
            }}
            style={styles.imageCover}>
            <Icon name="camera-outline" size={30} color={'#fff'} />
          </ImageBackground>
        </Pressable>
        <Pressable
          onPress={() => {
            setModalVisible(true);
            setTypeImage('avatar');
          }}>
          <ImageBackground
            style={styles.editAvatar}
            imageStyle={{borderRadius: 35}}
            source={{
              uri:
                profileUser?.imageAvatar?.uri
            }}>
            <Icon name="camera-outline" size={30} color={'#fff'} />
          </ImageBackground>
        </Pressable>
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <Text style={{fontSize: 18}}>Tên</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setProfileUser({
                ...profileUser,
                displayName: text,
              })
            }
            value={profileUser.displayName}
            placeholder="Tên không được để trống"
            maxLength={50}
          />
        </View>
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 18, marginTop: 20}}>Mô tả</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setProfileUser({
                ...profileUser,
                description: text,
              })
            }
            value={profileUser.description}
            placeholder="Mô tả"
            multiline
            maxLength={255}
          />
        </View>
      </View>
      {/* model choiceImage */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.model}>
          <View style={styles.choiceImage}>
            <TouchableOpacity style={{padding:4}} onPress={() => openCamera()}>
              <Text style={styles.textChoice}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:4}} onPress={() => openLibrary()}>
              <Text style={styles.textChoice}>Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* model loading */}
      <Modal
        backdropOpacity={0.3}
        isVisible={loading}>
        <View style={styles.model}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </>
  );
};

export default UpdateProfileUser;
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageCover: {
    width: width,
    height: height / 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatar: {
    marginTop: -35,
    marginLeft: 20,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 70,
    borderRadius: 70,
    height: 70,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 0.4,
    borderBottomColor: '#333',
  },
  model: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceImage: {
    padding: 20,
    width: width - 60,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 3,
  },
  textChoice: {
    fontSize: 16,
    paddingVertical: 5,
  },
});
