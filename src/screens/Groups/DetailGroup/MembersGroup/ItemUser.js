import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View ,TouchableOpacity,Pressable,Modal,ToastAndroid, Alert} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import {Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
const ItemUser = ({data,isAdmin,handleOnDeleteUser}) => {
    const navigation = useNavigation();
    const [user,setUser] =useState('')
    const [modalVisible,setModalVisible] = useState(false)
    useEffect(() => {
        const sub = firestore().collection('users').doc(data?.id).onSnapshot(doc=> {
            setUser({...doc.data()})
        })
        return () => sub()
    }, [])
    const handleClickButtonDeleteUser =()=>{
        Alert.alert('Thông báo', 'Bạn muốn xoá Tèo ra khỏi nhóm', [
      {
        text: 'Cancel',
        onPress: () => setModalVisible(false),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {handleOnDeleteUser(data?.id);setModalVisible(false)}},
    ]);
    }
    return (
        <>
        <TouchableOpacity
              style={styles.itemUser}
              onPress={() => {
                navigation.navigate('ProfileUser', {uidUser: user?.uid});
              }}>
              <Avatar
                source={{
                  uri:
                    user?.imageAvatar
                }}
                size={45}
                rounded
                containerStyle={{}}
              />
              <View style={{marginLeft: 10,flex: 1}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {user?.displayName }
                </Text>
                <Text style={{fontSize: 14}}>{user?.email}</Text>
              </View>
              {isAdmin && data?.id!== auth().currentUser.uid?<Pressable
              style={styles.moreUser}
              onPress={() => setModalVisible(true)}>
              <Icon name="ellipsis-horizontal" size={24} color="black" />
            </Pressable> : null}
            </TouchableOpacity>
            <Modal
        transparent={true}
        visible={modalVisible}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{flex: 1, backgroundColor: 'black', opacity: 0.2}}></Pressable>
        <View style={styles.moreUserContent}>
          <TouchableOpacity
            style={styles.moreUserItem}
            onPress={() => handleClickButtonDeleteUser()}
            >
            <Icon name="trash-outline" size={24} color="black" />
            <Text style={{fontSize: 16, marginLeft: 10}}>Xóa khỏi nhóm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
            </>
    )
}

export default ItemUser

const styles = StyleSheet.create({
    itemUser: {
        paddingHorizontal: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },  
    moreUser: {},
  moreUserContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
    paddingVertical: 20,
  },
  moreUserItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
