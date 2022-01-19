import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,Pressable,ToastAndroid } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Colors from "./../../assets/themes/Colors";
const ItemDataGroup = ({data}) => {
    const navigation = useNavigation();
    const [isJoin, setIsJoin] = useState(false);
    useEffect(() => {
        const sub = firestore().collection('groups').doc(data.id)
        .onSnapshot(doc => {
            setIsJoin(doc.data().members.includes(auth().currentUser.uid));
        });
        return () => {
            sub()
        }
    }, [])
    const handleOnJoinGroup = () => {
    firestore()
      .collection('groups')
      .doc(data.id)
      .update({
        members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(data.id)
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
        <TouchableOpacity
              style={styles.itemUser}
              onPress={() => {
                navigation.navigate('StackGroups', {
                  screen: 'DetailGroup',
                  params: {
                    id: data.id,
                  },
                })
              }}>
              <Image source={{
                  uri:
                    data?.imageCover
                }} style={styles.imageCover}/>
              <View style={{flex:1,marginLeft: 10}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {data.name}
                </Text>
                <Text style={{fontSize: 14}} numberOfLines={2}>Giời thiệu: {data.description}</Text>
              </View>
              <Pressable style={[styles.btnJoinGroup,isJoin?styles.btnJoinGroupActive:null]}
                onPress={() => {
                    handleOnJoinGroup();
                }}
                    disabled={isJoin}
                >
                <Text style={{color: '#fff'}}>{!isJoin?'Tham gia':'Đã tham gia'}</Text>
              </Pressable>
            </TouchableOpacity>
    )
}

export default ItemDataGroup

const styles = StyleSheet.create({
    itemUser: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  imageCover:{
      width:46,
        height:46,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#ddd'
  },
  btnJoinGroup:{
    marginRight:40,
    backgroundColor:'#00a680',
    backgroundColor:Colors.primary,
    padding:5,
    paddingHorizontal:10,
    borderRadius:5,
  },
  btnJoinGroupActive:{
      backgroundColor:'#999'
  }
})
