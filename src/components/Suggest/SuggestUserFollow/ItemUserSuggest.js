import { StyleSheet, Text, View,Image,TouchableOpacity,Dimensions,Pressable} from 'react-native'
import React,{useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ItemUserSuggest = ({item}) => {
  const [isFollow, setIsFollow] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
        const sub = firestore().collection('users').doc(auth().currentUser.uid)
        .onSnapshot(doc => {
            setIsFollow(doc.data().follow.includes(item.id));
        });
        return () => sub()
    }, [])
  const handleOnFollow =()=>{
        if(!isFollow)
                firestore().collection('users').doc(auth().currentUser.uid).update({
                    follow: firestore.FieldValue.arrayUnion(item.id)
                })
                .then(() => {
                    firestore().collection('users').doc(item.id).update({
                        follower: firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                    })
                    .then(() => {
                        handleAddNotificationUser()
                    })
                })
        else
            firestore().collection('users').doc(auth().currentUser.uid).update({
                follow: firestore.FieldValue.arrayRemove(item.id)
            }
            )
            .then(() => {
                firestore().collection('users').doc(item.id).update({
                    follower: firestore.FieldValue.arrayRemove(auth().currentUser.uid)
                })
                })
    }
    const handleAddNotificationUser = () => {
        firestore().collection('users').doc(item.id).collection('notifications')
        .doc(`Follower${auth().currentUser.uid}`).set({
            type: 'Follower',
            idUserFollow: auth().currentUser.uid,
            createdAt: new Date().getTime(),
            watched: false
        })
    }
  return (
    <TouchableOpacity style={styles.container}
     onPress={() => {
                navigation.navigate('ProfileUser', {uidUser: item.uid});
              }}>
      <View style={styles.avatar}>
        <Image source={{uri: item.imageAvatar}} style={styles.avatarImg}/>
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.displayName}</Text>
      <Pressable style={[styles.btnFollowUser,isFollow?styles.btnFollowUserActive:null]}
                onPress={() => {
                    handleOnFollow();
                }}
                >
                <Text style={{color: '#fff',textAlign:'center'}}>{!isFollow?'Theo đõi' : 'Đang theo đõi'}</Text>
      </Pressable>
    </TouchableOpacity>
  )
}

export default ItemUserSuggest
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