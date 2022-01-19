import React,{useState, useEffect}from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Pressable } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Colors from "./../../assets/themes/Colors";
const ItemUserMessage = ({data}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
              style={styles.itemUser}
              onPress={() => {
               navigation.navigate('Messages', {uidUserReceiver: data.id});
              }}>
              <Avatar
                source={{
                  uri:
                    data.imageAvatar||
                    'https://image.flaticon.com/icons/png/512/149/149071.png',
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
        </TouchableOpacity>
    )
}

export default ItemUserMessage

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
