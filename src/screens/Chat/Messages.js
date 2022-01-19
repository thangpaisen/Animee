import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View,Pressable } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
const Messages = ({route}) => {
    const {uidUserReceiver} = route.params;
    const [messages, setMessages] = useState([]);
    const [userReceiver, setUserReceiver] = useState({})
    const navigation = useNavigation();
    const ref =firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('messages_threads')
      .doc(uidUserReceiver)
    const ref2 =firestore()
      .collection('users')
      .doc(uidUserReceiver)
      .collection('messages_threads')
      .doc(auth().currentUser.uid)
  useEffect(() => {
    const sub = ref.collection('messages').orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        var messages =[] ;
        querySnapshot.forEach(doc => {
         messages.push({
            ...doc.data(),
          });
        });
        setMessages(messages);
      });
      const sub2 = firestore().collection('users').doc(uidUserReceiver).onSnapshot(doc => {
        setUserReceiver({...doc.data()});
      });
    return ()=>{
        sub()
        sub2()
    }
  }, [])
  const onSend = useCallback((messages) => {
      const text = messages[0].text;
        ref.collection('messages').add({
            _id:new Date().getTime(),
            text,
            createdAt: new Date().getTime(),
            user: {
            _id: auth().currentUser.uid,
            },
        })
        ref2.collection('messages').add({
            _id:new Date().getTime(),
            text,
            createdAt: new Date().getTime(),
            user: {
            _id: auth().currentUser.uid,
            },
        })
        ref.set({
            user: {
            _id: auth().currentUser.uid,
            },
          lastMessage: {
            text,
            image: '',
            sizeImage:{},
            createdAt: new Date().getTime(),
          },
        watched: true,
          hide: false
        }
      );
      ref2.set({
            user: {
            _id: auth().currentUser.uid,
            },
          lastMessage: {
            text,
            image: '',
            sizeImage:{},
            createdAt: new Date().getTime(),
          },
          watched: false,
          hide: false
        }
      );
  }, [])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{marginRight:10}}> 
          <Icon name="chevron-back-outline" size={30} color={'black'} />
        </Pressable>
        <Avatar
                source={{
                  uri: userReceiver.imageAvatar
                }}
                size={30}
                rounded
              />
        <Text style={{fontSize:18,fontWeight: 'bold',flex:1,paddingHorizontal:10,}} numberOfLines={1}>{userReceiver.displayName}</Text>
      </View>
            <GiftedChat
                scrollToBottom 
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id:auth().currentUser.uid
                }}
                />
        </View>
    )
}

export default Messages

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
    },
    header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    backgroundColor: 'white'
  },
})
