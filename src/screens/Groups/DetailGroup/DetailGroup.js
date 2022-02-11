import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ToastAndroid,
  Alert,
  ImageBackground
} from 'react-native';
import Header from './Header';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemMember from './ItemMember';
import { Avatar, Button } from "react-native-elements";
import ItemPost from './ItemPost';
import {useNavigation} from '@react-navigation/native';
import Loading from './../../../components/Loading';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
const DetailGroup = ({route}) => {
  const {id} = route.params;
  const navigation = useNavigation();
  const groupRef = firestore().collection('groups').doc(id);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [dataGroup, setDataGroup] = useState({});
  const [postsGroup, setPostsGroup] = useState([]);
  const [imageCoverTmp, setImageCoverTmp] = useState({
    fileName: '',
    uri: '',
  });
  const user = useSelector(state => state.user.data);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkUserJoined, setCheckUserJoined] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  useEffect(() => {
    setLoading(true);
    const sub = groupRef.onSnapshot(doc => {
      setDataGroup({...doc.data(), id: doc.id});
      setCheckUserJoined(doc.data().members.includes(auth().currentUser.uid));
      setIsAdmin(doc.data().managers.includes(auth().currentUser.uid));
    });
    const sub3 = groupRef
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(doc => {
        setPostsGroup(
          doc.docs.map(item => {
            return {
              ...item.data(),
              id: item.id,
              idGroup: id,
            };
          }),
        );
        setLoading(false);
      });
    return () => {
      sub();
      sub3();
    };
  }, []);
  const handleOnJoinGroup = () => {
    firestore()
      .collection('groups')
      .doc(id)
      .update({
        members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(id)
          .collection('member')
          .doc(auth().currentUser.uid)
          .set({
            uid: auth().currentUser.uid,
            role: 'member',
            createdAt: new Date().getTime(),
          })
          .then(() => {
            ToastAndroid.show('Bạn đã tham gia nhóm', ToastAndroid.SHORT);
          });
      });
  };
  const handleClickButtonLeaveGroup = () => {
    Alert.alert('Thông báo', 'Bạn chắc chắn muốn rời khỏi nhóm', [
      {
        text: 'Cancel',
        onPress: () => setModalVisible(false),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleOnLeaveGroup()},
    ]);
  };
  const handleOnLeaveGroup = () => {
    firestore()
      .collection('groups')
      .doc(dataGroup.id)
      .update({
        members: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(dataGroup.id)
          .collection('member')
          .doc(auth().currentUser.uid)
          .delete()
          .then(() => {
            ToastAndroid.show('Bạn đã rời khỏi nhóm', ToastAndroid.SHORT);
            setModalVisible(false);
          });
      })
      .catch(err => {
        ToastAndroid.show('Lỗi', ToastAndroid.SHORT);
      });
  };
  const handleClickButtonReportGroup = () => {
    Alert.alert(
      'Báo cáo nhóm',
      'Bạn có chắc chắn muốn báo cáo nhóm?',
      [
        {
          text: 'Hủy',
          onPress: () => {
            setModalVisible(false);
          },
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleOnRePortGroup()},
      ],
      {cancelable: false},
    );
  };
  const handleOnRePortGroup = () => {
    firestore()
      .collection('groups')
      .doc(dataGroup.id)
      .update({
        report: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
      })
      .then(() => {
        ToastAndroid.show('Bạn đã báo cáo nhóm', ToastAndroid.SHORT);
        setModalVisible(false);
      });
  };
  const handleOnSave = async () => {
    setLoading2(true);
    let uriImageCover = '';
    const reference = storage().ref(imageCoverTmp.fileName);
    await reference.putFile(imageCoverTmp.uri);
    uriImageCover = await storage()
      .ref(imageCoverTmp.fileName)
      .getDownloadURL();
    await groupRef.update({
      imageCover: uriImageCover,
    });
    setImageCoverTmp({
      fileName: '',
      uri: '',
    });
    setLoading2(false);
    ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
  }
  const openLibrary = () => {
    ImagePicker.openPicker({mediaType: 'photo'}).then(image => {
      setImageCoverTmp({uri: image.path, fileName: image.modificationDate});
    }).catch(error => {
    });
    setModalVisibleEdit(false);
  };
  const openCamera = () => {
    ImagePicker.openCamera({mediaType: 'photo'}).then(image => {
      setImageCoverTmp({uri: image.path, fileName: image.modificationDate});
    }).catch(error => {
    });
    setModalVisibleEdit(false);
  };
  return (
    <>
      <View style={styles.container}>
        <Header
          data={dataGroup}
          isAdmin={isAdmin}
          setModalVisible={setModalVisible}
        />
        {!loading ? (
          <ScrollView style={styles.content}>
            <View style={styles.imageCover}>
              <ImageBackground 
                source={{
                  uri: imageCoverTmp.uri|| dataGroup?.imageCover,
                }}
                style={styles.image}
              >
              {isAdmin&&<>
              <TouchableOpacity
                style={styles.editImageCover}
                onPress={() => setModalVisibleEdit(true)}>
                <Icon name="pencil-outline" size={20} color="black" />
                <Text style={styles.textBold}>Chỉnh sửa</Text>
              </TouchableOpacity>
              {imageCoverTmp.uri.length> 0?
              <View style={styles.action}>
                <TouchableOpacity  style={styles.btnExit} onPress={() => {
                  setImageCoverTmp({
                    uri: '',
                    fileName: ''
                  });
                  ImagePicker.clean();
                }}>
                <Text style={styles.textBold}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={() => {
                // groupRef.update({
                //   imageCover: imageCoverTmp,
                // });
                // setImageCoverTmp('');
                handleOnSave()
              }}>
                <Text style={styles.textBold}>Lưu</Text>
              </TouchableOpacity>
              </View>: null}
              </>}
              </ImageBackground>
            </View>
            <TouchableOpacity
              style={styles.info}
              onPress={() =>
                navigation.navigate('DescGroup', {dataGroup: dataGroup})
              }>
              <View style={styles.nameGroup}>
                <Text style={styles.title}>{dataGroup?.name}</Text>
                <Icon
                  name="chevron-forward-outline"
                  size={20}
                  color="#000"
                  style={styles.icon}
                />
              </View>
              <Text style={styles.totalMembers}>
                {dataGroup?.members?.length} ➼ thành viên
              </Text>
            </TouchableOpacity>
            {dataGroup?.isBlocked ? (
              <GroupIsBlocker />
            ) : (
              <>
                {checkUserJoined ? (
                  <>
                    <View style={styles.members}>
                      {dataGroup?.members?.map((item, index) => {
                        return (
                          <ItemMember key={index} data={item} index={index} />
                        );
                      })}
                      <TouchableOpacity
                        style={styles.addMember}
                        onPress={() =>
                          navigation.navigate('InvitesFriends', {idGroup: id})
                        }>
                        <Icon name="add-outline" size={20} color="#fff" />
                        <Text style={styles.textAddMember}>Mời</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.announced}>
                      <Icon name="bookmark-outline" size={20} color="gray" />
                      <Text style={styles.titleAnnounced}>Thông báo</Text>
                    </View>
                    {/* bulkhead */}
                    <View style={styles.bulkhead} />
                    {/* upPost */}
                    <Pressable
                      style={styles.upPost}
                      onPress={() =>
                        navigation.navigate('UploadPost', {
                          ref: groupRef.collection('posts'),
                        })
                      }>
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
                      <View style={styles.inputPost}>
                        <Text style={styles.inputText}>
                          Bạn đang nghĩ gì....
                        </Text>
                      </View>
                    </Pressable>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.btnJoinGroup}
                    onPress={() => handleOnJoinGroup()}>
                    <Text style={styles.textJoinGroup}>Tham gia nhóm</Text>
                  </TouchableOpacity>
                )}
                <View style={[styles.bulkhead]}>
                  <Text style={{padding: 10, fontWeight: 'bold'}}>
                    Bài viết gần đây
                  </Text>
                </View>
                {postsGroup.map(item => (
                  <ItemPost item={item} key={item.id} id={id} />
                ))}
              </>
            )}
          </ScrollView>
        ) : (
          <Loading />
        )}
      </View>
      {/* model option */}
      <Modal transparent={true} visible={modalVisible}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{flex: 1, backgroundColor: 'black', opacity: 0.2}}>
        </Pressable>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalItem} onPress={() => {}}>
            <Icon name="arrow-redo-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>Chia sẻ nhóm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              handleClickButtonReportGroup();
            }}>
            <Icon name="information-circle-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>Báo cáo nhóm</Text>
          </TouchableOpacity>
          {checkUserJoined && (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleClickButtonLeaveGroup()}>
              <Icon name="log-out-outline" size={24} color="black" />
              <Text style={{fontSize: 16, marginLeft: 10}}>Rời khỏi nhóm</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
      {/* model choiceImage */}
      <Modal
        transparent={true} visible={modalVisibleEdit}
        onBackdropPress={() => setModalVisibleEdit(false)}>
        <Pressable
          onPress={() => setModalVisibleEdit(false)}
          style={{flex: 1, backgroundColor: 'black', opacity: 0.2}}>
        </Pressable>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalItem}onPress={() => openCamera()}>
              <Text style={styles.textChoice}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => openLibrary()}>
              <Text style={styles.textChoice}>Library</Text>
            </TouchableOpacity>
        </View>
      </Modal>
      {/* model loading */}
      <Modal
        transparent={true} visible={loading2}>
        <View style={styles.model}>
          <ActivityIndicator size="large" color="#00a1f2" />
        </View>
      </Modal>
    </>
  );
};

const GroupIsBlocker = () => {
  return (
    <View
      style={{
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 30, fontWeight: 'bold', color: 'red'}}>
        Nhóm này đã bị Khoá
      </Text>
    </View>
  );
};

export default DetailGroup;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  editImageCover: {
    position: 'absolute',
    bottom: 4, right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#999',
    borderRadius: 4,
  },
  action: {
        position: 'absolute',
    top: 4, right: 4,
    flexDirection: 'row',
  },
  btnSave:{
    padding:8,
    paddingHorizontal: 12,
    backgroundColor: '#00a1f2',
    borderRadius: 4,
    marginLeft: 10,
  },
  btnExit:{
    padding:8,
    paddingHorizontal: 12,
    backgroundColor: 'gray',
    borderRadius: 4,
    marginLeft: 10,
  },
  textBold:{
    fontWeight: 'bold'
  },
  info: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nameGroup: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 10,
  },
  totalMembers: {
    fontSize: 18,
    color: 'gray',
  },
  members: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMember: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#00a1f2',
  },
  textAddMember: {
    fontSize: 18,
    color: 'white',
  },
  btnJoinGroup: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#00a1f2',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  textJoinGroup: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  announced: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.3,
    borderTopColor: '#d1d1d1',
  },
  titleAnnounced: {
    fontSize: 18,
    color: 'gray',
    marginLeft: 10,
  },
  bulkhead: {
    marginVertical: 10,
    paddingVertical: 3,
    backgroundColor: '#e3e3e3',
  },
  upPost: {
    marginLeft: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputPost: {
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ebebeb',
  },
  inputText: {
    paddingLeft: 10,
    fontSize: 16,
    color: 'gray',
  },
  modalContent: {
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
  modalItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  model: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
