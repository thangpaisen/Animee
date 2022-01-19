import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  BackHandler
} from 'react-native';
import {Avatar} from 'react-native-elements';
import ItemPost from './ItemPost';
import {useNavigation} from '@react-navigation/native';
import Header from './Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loading from './../../components/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from './../../redux/actions/user';
import {getListPostFollow} from './../../redux/actions/listPostFollow';
import Nodata from "./../../components/Nodata";

const Home = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.data);
  const [postsUser, setPostsUser] = useState([]);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const refPosts = firestore().collection('postsUser')
  useEffect(() => {
    setLoading(true);
    setRefreshing(false);
    const sub = refPosts
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const listPostUser = [];
        querySnapshot.forEach(doc => {
          if (
            doc.data().uidUser === user?.uid ||
            user?.follow?.indexOf(doc.data().uidUser) >= 0
          )
            listPostUser.push({
              id: doc.id,
              ...doc.data(),
            });
        });
        setPostsUser(listPostUser);
        setLoading(false);
      });
    return () => {
      sub();
    };
  }, [refreshing,user]);
  return (
    <View style={styles.container}>
      <Header user={user} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }>
        <Pressable
          style={styles.upPost}
          onPress={() => navigation.navigate('UploadPost',{ref:refPosts})}>
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
            <Text style={styles.inputText}>Bạn đang nghĩ gì....</Text>
          </View>
        </Pressable>
        {!loading ? (
          <>
            {postsUser.map(item => (
              <ItemPost item={item} key={item.id} />
            ))}
          </>
        ) : (
          <Loading />
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  upPost: {
    marginTop: 10,
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
});
