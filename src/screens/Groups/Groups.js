import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemPostGroups from './ItemPostGroups';
import Header from './Header';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loading from "./../../components/Loading";
import Nodata from "./../../components/Nodata";
import {showInterstitialAd} from '../../firebase/Admob';
import {setCountZero,setCountIncremented} from '../../redux/actions/countLoadAdmob';
import {useDispatch, useSelector} from 'react-redux';
const Groups = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const countLoadAdmob = useSelector(state => state.countLoadAdmob);
  const [myGroups, setMyGroups] = React.useState([]);
  const [postsGroups, setPostsGroups] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('groups')
      .where('members', 'array-contains', auth().currentUser.uid)
      .onSnapshot(querySnapshot => {
        setMyGroups(querySnapshot.docs.map(item => ({...item.data(),id: item.id})));
      });
    firestore()
      .collection('groups')
      .where('members', 'array-contains', auth().currentUser.uid)
      .get()
      .then(async querySnapshot => {
        const postsGroups = [];
        for (const doc of querySnapshot.docs) {
          await firestore().collection(`groups/${doc.id}/posts`).orderBy('createdAt', 'desc').get().then(querySnapshot => {
            querySnapshot.docs.forEach(doc2 => {
              postsGroups.push({
                ...doc2.data(),
                id: doc2.id,
                idGroup: doc.id,
              });
            });
          });
        }
        setPostsGroups(postsGroups.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false)
      });
      setRefreshing(false);
    return () => unsubscribe();
  }, [refreshing]);
  useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if(countLoadAdmob>=20){
                showInterstitialAd();
                dispatch(setCountZero());
            }
            else dispatch(setCountIncremented());
        });
        return unsubscribe;
    }, [countLoadAdmob]);
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.listTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate('StackGroups', {screen: 'CreateGroup'})
          }>
          <Icon name="add-circle-outline" size={22} color="#000" />
          <Text style={styles.textTab}>Tạo nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
                navigation.navigate('StackGroups', {screen: 'Invites'})}
        >
          <Icon name="mail-outline" size={22} color="#000" />
          <Text style={styles.textTab}>Lời mời</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
                navigation.navigate('StackGroups', {screen: 'Membership'})}
        >
          <Icon name="log-out-outline" size={22} color="#000" />
          <Text style={styles.textTab}>Thành viên</Text>
        </TouchableOpacity>
      </View>
      {(loading || myGroups.length>0)?
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }>
        <View style={styles.listGroup}>
          <View style={styles.headerListGroup}>
            <Text style={styles.textHeaderListGroup}>Nhóm của tôi</Text>
            <TouchableOpacity
              style={styles.buttonMoreListGroup}
              onPress={() =>
                navigation.navigate('StackGroups', {
                  screen: 'MyGroups',
                  params: {
                    myGroups: myGroups,
                  },
                })
              }>
              <Text style={styles.textButtonMoreListGroup}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {loading?<Loading />:
          <FlatList
            data={myGroups}
            horizontal
            renderItem={({item}) => (
              <Pressable
                style={styles.itemGroup}
                onPress={() =>
                  navigation.navigate('StackGroups', {
                    screen: 'DetailGroup',
                    params: {id: item.id},
                  })
                }>
                <Image
                  source={{
                    uri:
                      item.imageCover ||
                      'https://images6.alphacoders.com/102/1029037.jpg',
                  }}
                  style={styles.imgGroup}
                />
                <Text style={styles.nameGroup} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => item.id}
          />}
        </View>
        {loading?<Loading />:postsGroups.map(item => (
          <ItemPostGroups key={item.id} item={item} />
        ))}
      </ScrollView>
      :<Nodata title="Bạn chưa tham gia nhóm nào" />}
    </View>
  );
};

export default Groups;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemGroup: {
    width: width / 4,
    marginLeft: 10,
  },
  imgGroup: {
    width: width / 4,
    height: width / 4,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  nameGroup: {
    padding: 4,
    fontSize: 14,
  },
  listTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#e3e3e3',
  },
  textTab: {
    paddingLeft: 4,
    fontWeight: 'bold',
  },
  listGroup: {
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 6,
    borderBottomColor: '#e3e3e3',
  },
  headerListGroup: {
    padding: 10,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHeaderListGroup: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonMoreListGroup: {
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#e3e3e3',
  },
});
