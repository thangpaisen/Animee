import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar, Badge} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {getAuth, updatePassword} from 'firebase/auth';
import ItemRoomChat from './ItemRoomChat';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ItemUserOnline from './ItemUserOnline';
import Nodata from './../../components/Nodata';
import Loading from './../../components/Loading';
import admob, {
  MaxAdContentRating,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdMobRewarded,
} from '@react-native-firebase/admob';
import Header from './Header';
import {showInterstitialAd} from '../../firebase/Admob';
const Chat = () => {
  const [listUsers, setListUsers] = useState([]);
  const [messagesThreads, setMessagesThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const me = useSelector(state => state.user.data);
  const navigation = useNavigation();
  useEffect(() => {
    const sub = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        var listUsers = [];
        querySnapshot.forEach(doc => {
          if (me?.follow.includes(doc.id))
            listUsers.unshift({
              id: doc.id,
              ...doc?.data(),
            });
        });
        setListUsers(listUsers);
      });
    return () => {
      sub();
    };
  }, [me]);
  useEffect(() => {
    setLoading(true);
    const sub2 = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('messages_threads')
      .orderBy('lastMessage.createdAt')
      .onSnapshot(querySnapshot => {
        var messagesThreads = [];
        querySnapshot.forEach(doc => {
          if (!doc?.data().hide)
            messagesThreads.unshift({
              id: doc.id,
              ...doc?.data(),
            });
        });
        setMessagesThreads(messagesThreads);
        setLoading(false);
      });
    return () => {
      sub2();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.listFriendOnLine}>
        <FlatList
          horizontal
          data={listUsers}
          renderItem={({item, index}) => <ItemUserOnline item={item} />}
          keyExtractor={item => item.id}
        />
      </View>
      <View
        style={{
          height: 4,
          backgroundColor: '#ededed',
          marginVertical: 10,
        }}></View>
      {loading ? (
        <Loading />
      ) : messagesThreads.length > 0 ? (
        <View style={styles.listMessage}>
          <FlatList
            data={messagesThreads}
            renderItem={({item, index}) => <ItemRoomChat item={item} />}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <Nodata title="Không có tin nhắn nào, bạn có thể tìm kiếm người để bắt đầu cuộc trò chuyện của mình" />
      )}
      <View style={{alignSelf: 'center', marginBottom: 5}}>
        <BannerAd
          size={BannerAdSize.BANNER}
          // size={BannerAdSize.SMART_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          unitId={'ca-app-pub-5057240456793980/6870738526'}
          onAdLoaded={() => {
            console.log('Advert loaded3');
          }}
          onAdFailedToLoad={error => {
            console.log('Advert failed to load: ', error);
          }}
        />
      </View>
    </View>
  );
};

export default Chat;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#e3e3e3',
  },
  textHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listFriendOnLine: {
    marginTop: 10,
    flexDirection: 'row',
  },
  listMessage: {
    flex: 1,
  },
  itemMessage: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  nameFriendMessage: {
    fontSize: 16,
    color: '#000',
  },
  lastMessage: {
    marginTop: 4,
    color: 'gray',
  },
});
