import React,{useState, useEffect}from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Pressable } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Colors from "./../../assets/themes/Colors";
const ItemDataMember = ({data}) => {
    const navigation = useNavigation();
    const [isFollow, setIsFollow] = useState(false);
    useEffect(() => {
        const sub = firestore().collection('users').doc(auth().currentUser.uid)
        .onSnapshot(doc => {
            setIsFollow(doc.data().follow.includes(data.id));
        });
        return () => sub()
    }, [])
    const handleOnFollow =()=>{
        if(!isFollow)
                firestore().collection('users').doc(auth().currentUser.uid).update({
                    follow: firestore.FieldValue.arrayUnion(data.id)
                })
                .then(() => {
                    firestore().collection('users').doc(data.id).update({
                        follower: firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                    })
                    .then(() => {
                        handleAddNotificationUser()
                    })
                })
        else
            firestore().collection('users').doc(auth().currentUser.uid).update({
                follow: firestore.FieldValue.arrayRemove(data.id)
            }
            )
            .then(() => {
                firestore().collection('users').doc(data.id).update({
                    follower: firestore.FieldValue.arrayRemove(auth().currentUser.uid)
                })
                })
    }
    const handleAddNotificationUser = () => {
        firestore().collection('users').doc(data.id).collection('notifications')
        .doc(`Follower${auth().currentUser.uid}`).set({
            type: 'Follower',
            idUserFollow: auth().currentUser.uid,
            createdAt: new Date().getTime(),
            watched: false
        })
    }
    return (
        <TouchableOpacity
              style={styles.itemUser}
              onPress={() => {
                navigation.navigate('ProfileUser', {uidUser: data.uid});
              }}>
              <Avatar
                source={{
                  uri:
                    data.imageAvatar
                }}
                size={45}
                rounded
                containerStyle={{}}
              />
              <View style={{marginLeft: 10,flex:1}} >
                <Text style={{fontSize: 16, fontWeight: 'bold'}} numberOfLines={1}>
                  {data?.displayName || 'Người dùng ... '}
                </Text>
                <Text style={{fontSize: 14}} numberOfLines={1}>{data.email}</Text>
              </View>
              {auth().currentUser.uid!==data.id&&<Pressable style={[styles.btnFollowUser,isFollow?styles.btnFollowUserActive:null]}
                onPress={() => {
                    handleOnFollow();
                }}
                    // disabled={isFollow}
                >
                <Text style={{color: '#fff'}}>{!isFollow?'Theo đõi':'Dang theo đõi'}</Text>
              </Pressable>}
        </TouchableOpacity>
    )
}

export default ItemDataMember

const styles = StyleSheet.create({
    itemUser: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  btnFollowUser:{
    marginRight:40,
    backgroundColor:'#00a680',
    backgroundColor:Colors.primary,
    padding:5,
    paddingHorizontal:10,
    borderRadius:5,
  },
  btnFollowUserActive:{
      backgroundColor:'#999'
  }
})
