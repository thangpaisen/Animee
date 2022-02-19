import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Header from './Header';
import {Avatar} from 'react-native-elements';
import ItemPost from './../Home/ItemPost';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {getListPostUser} from './../../redux/actions/listPostUser';
import {getUser} from './../../redux/actions/user';
import {getUserById} from './../../redux/actions/userById';
import {getListPostByUser} from './../../redux/actions/listPostByUser';
import Loading from './../../components/Loading';

const ProfileUser = ({route}) => {
  const {uidUser} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(state => state.user.data);
  const [userProfile,setUserProfile] = useState({});
  const [listPostUser,setListPostUser] = useState([]);
  // const userProfile = useSelector(state => state.userById.data);
  // const listPostUser = useSelector(state => state.listPostByUser.data);
  // const ld1 = useSelector(state => state.user.loading);
  // const ld2 = useSelector(state => state.userById.loading);
  // const ld3 = useSelector(state => state.listPostByUser.loading);
  useEffect(() => {
    // const unsubscribe2 = dispatch(getUserById(uidUser));
    // const unsubscribe3 = dispatch(getListPostByUser(uidUser));
    const sub1 = firestore().collection('users').doc(uidUser).onSnapshot(doc => {
      setUserProfile({...doc.data(), id: doc.id});
    });
    const sub2 = firestore().collection('postsUser').where('uidUser', '==', uidUser)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        setListPostUser(data);
      });
    return () => {
      sub1();
      sub2();
    };
  }, []);
  const handleOnFollow = () => {
    if (!me?.follow?.includes(uidUser)) {
      firestore()
        .collection('users')
        .doc(me.uid)
        .update({
          follow: firestore.FieldValue.arrayUnion(uidUser),
        });
      firestore()
        .collection('users')
        .doc(uidUser)
        .update({
          follower: firestore.FieldValue.arrayUnion(me.uid),
        })
        .then(() =>
        {
          firestore().collection('users').doc(uidUser).collection('notifications')
            .doc(`Follower${auth().currentUser.uid}`).set({
                type: 'Follower',
                idUserFollow: auth().currentUser.uid,
                createdAt: new Date().getTime(),
                watched: false
            })
      })
    } else {
      firestore()
        .collection('users')
        .doc(me.uid)
        .update({
          follow: firestore.FieldValue.arrayRemove(uidUser),
        });
      firestore()
        .collection('users')
        .doc(uidUser)
        .update({
          follower: firestore.FieldValue.arrayRemove(me.uid),
        });
    }
  };
  return (
    <View style={styles.container}>
      <Header title={userProfile.displayName} uidUser={uidUser} />
      <ScrollView>
        <View style={styles.profile}>
          <Image
            source={{
              uri: userProfile?.imageCover,
            }}
            style={styles.imageCover}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            <Avatar
              source={{
                uri: userProfile?.imageAvatar,
              }}
              size={70}
              rounded
              containerStyle={{marginTop: -35}}
            />
            {auth().currentUser.uid === uidUser ? (
              <TouchableOpacity
                style={styles.editProfile}
                onPress={() =>
                  navigation.navigate('UpdateProfileUser', {user: me})
                }>
                <Text style={styles.textEditProfile}>Chỉnh sửa hồ sơ</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.editProfile,
                  !me?.follow?.includes(uidUser) && {backgroundColor: 'black'},
                ]}
                onPress={() => {
                  handleOnFollow();
                }}>
                <Text
                  style={[
                    styles.textEditProfile,
                    !me?.follow?.includes(uidUser) && {color: 'white'},
                  ]}>
                  {!me?.follow?.includes(uidUser)
                    ? 'Theo dõi'
                    : 'Đang theo dõi'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.name}>{userProfile.displayName}</Text>
          <Text style={styles.description}>{userProfile.description}</Text>
          <View style={styles.follower}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ListUserFollow', {
                  userProfile: userProfile,
                })
              }>
              <Text style={{fontSize: 14, marginRight: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {userProfile?.follow?.length}{' '}
                </Text>
                Đang theo đõi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ListUserFollower', {
                  userProfile: userProfile,
                })
              }>
              <Text style={{fontSize: 14, marginRight: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {userProfile?.follower?.length}{' '}
                </Text>
                Người theo đõi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {auth().currentUser.uid === uidUser && (
          <Pressable
            style={styles.upPost}
            onPress={() =>
              navigation.navigate('UploadPost', {
                ref: firestore().collection('postsUser'),
              })
            }>
            <View style={styles.avatar}>
              <Avatar
                size={36}
                rounded
                source={{
                  uri: userProfile?.imageAvatar,
                }}
              />
            </View>
            <View style={styles.inputPost}>
              <Text style={styles.inputText}>Bạn đang nghĩ gì....</Text>
            </View>
          </Pressable>
        )}
        <View style={{marginTop: 20}}>
          <Text style={{padding: 10, fontSize: 18, fontWeight: 'bold'}}>
            Bài viết
          </Text>
          {listPostUser?.map((item, index) => (
            <ItemPost item={item} key={item.id} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileUser;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profile: {},
  imageCover: {
    width: width,
    height: height / 5,
  },
  editProfile: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,

    padding: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textEditProfile: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 14,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  follower: {
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  upPost: {
    marginTop: 20,
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
  },
  inputText: {
    fontSize: 16,
    color: 'gray',
  },
});
