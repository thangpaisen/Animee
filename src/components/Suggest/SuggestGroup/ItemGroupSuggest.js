import { StyleSheet, Text, View,Image,TouchableOpacity,Dimensions,Pressable,ToastAndroid} from 'react-native'
import React,{useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ItemGroupSuggest = ({item}) => {
  const [isJoin, setIsJoin] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
        const sub = firestore().collection('groups').doc(item.id)
        .onSnapshot(doc => {
            setIsJoin(doc.data().members.includes(auth().currentUser.uid));
        });
        return () => sub()
    }, [])
  const handleOnJoinGroup = () => {
    firestore()
      .collection('groups')
      .doc(item.id)
      .update({
        members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(item.id)
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
  return (
    <TouchableOpacity style={styles.container}
     onPress={() => {
                navigation.navigate('StackGroups', {
                  screen: 'DetailGroup',
                  params: {
                    id: item.id,
                  },
                })
              }}>
      <View style={styles.avatar}>
        <Image source={{uri: item.imageCover}} style={styles.avatarImg}/>
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Pressable style={[styles.btnFollowUser,isJoin?styles.btnFollowUserActive:null]}
                onPress={() => {
                    handleOnJoinGroup();
                }}
                >
                <Text style={{color: '#fff',textAlign:'center'}}>{!isJoin?'Tham gia' : 'Đã tham gia'}</Text>
      </Pressable>
    </TouchableOpacity>
  )
}

export default ItemGroupSuggest
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container:{
    margin:10,
    marginLeft:0,
    width: width/4,
    alignItems: 'center',

  },
  avatarImg:{
    width: width/4,
    height: width/4,
    borderRadius:10,
  },
  name:{
    marginVertical:5,
    textAlign:'center',
    fontSize:12,
    color:'#000',
  },
  btnFollowUser:{
    backgroundColor:'#00a680',
    backgroundColor:'#00bcd4',
    padding:5,
    paddingHorizontal:10,
    borderRadius:5,
  },
  btnFollowUserActive:{
      backgroundColor:'#999'
  }
})