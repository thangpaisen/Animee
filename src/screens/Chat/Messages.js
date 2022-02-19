import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View,Pressable,Dimensions,Image } from 'react-native'
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Composer,
  Actions,
} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import Lightbox from 'react-native-lightbox-v2';
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
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
  const handleSendImage = async (uri,height,width) => {
    console.log("handleSendImage",uri,height,width)
    ref.collection('messages').add({
            _id:new Date().getTime(),
            image: uri,
            sizeImage:{
              width, 
              height
            },
            text:'',
            createdAt: new Date().getTime(),
            user: {
            _id: auth().currentUser.uid,
            },
        })
        ref2.collection('messages').add({
            _id:new Date().getTime(),
            image: uri,
            sizeImage:{
              width, 
              height
            },
            text:'',
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
            image: uri,
            sizeImage:{
              width, 
              height
            },
            text:'',
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
            image: uri,
            sizeImage:{
              width, 
              height
            },
            text:'',
            sizeImage:{},
            createdAt: new Date().getTime(),
          },
          watched: false,
          hide: false
        }
      );
  };
  const openLibrary = () => {
    console.log('openLibrary')
     ImagePicker.openPicker({mediaType: 'photo'}).then(image => {
       console.log('image',image);
      upLoadedImageToFirebase(image.path,image.modificationDate,image.width,image.height);
    }).catch(error => {
    });
  };
  const openCamera = () => {
    ImagePicker.openCamera({mediaType: 'photo'}).then(image => {
      upLoadedImageToFirebase(image.path,image.modificationDate,image.width,image.height);
    }).catch(error => {
    });
  };
  const upLoadedImageToFirebase = async (uri, fileName,height,width) => {
    console.log("upLoadedImageToFirebase",uri,fileName)
    const reference = storage().ref(fileName);
    await reference.putFile(uri);
    var url = await storage().ref(fileName).getDownloadURL();
    console.log("url",url)
    handleSendImage(url,height,width);
  };
  const renderActions = props => {
    return (
      <Actions
        {...props}
        options={{
          ['Camera']: () => openCamera(),
          ['Library']: () => openLibrary(),
        }}
        // onSend={args => console.log('args')}
        icon={() => (
          <View style={{marginTop: -2}}>
            <Icon name="image-outline" size={24} color="black" />
          </View>
        )}
      />
    );
  };
  const renderMessageImage = props => {
    let {height, width} = props.currentMessage.sizeImage;
    return(
      <View 
        style={{backgroundColor:'transparent'}}
        >
          <Lightbox
            activeProps={{
              style: {flex: 1,resizeMode: 'contain'},
            }}
            >
              <Image
                style={[{resizeMode:'stretch',width:windowWidth/2,height:windowWidth/2 /(width/height),borderRadius:10}]}
                source={{ uri: props.currentMessage.image }}
              />
            </Lightbox>
        </View>
    )
  };
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
                renderActions={renderActions} //Nút hành động tùy chỉnh ở bên trái của trình soạn tin nhắn
                renderMessageImage={renderMessageImage}
                onSend={messages => onSend(messages)}
                user={{
                    _id:auth().currentUser.uid
                }}
                />
        </View>
    )
}

export default Messages
const windowWidth =  Dimensions.get('window').width;
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
