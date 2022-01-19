import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { Avatar } from 'react-native-elements';
const ItemMember = ({data,index}) => {
    const [dataUser, setDataUser] = useState({})
    useEffect(() => {
        const sub = firestore().collection('users').doc(data).onSnapshot(doc => {
            setDataUser(doc.data())
        })
        return () => {
            sub()
        }
    }, [])
    return (
        <TouchableOpacity style={[styles.member, index > 0 &&styles.mgLeft]}>
                        <Image
                            source={{
                                uri: dataUser?.imageAvatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                            }}
                            style={styles.avatar}
                        />
        </TouchableOpacity>
    )
}

export default ItemMember

const styles = StyleSheet.create({
    mgLeft: {
        left: -10,
    },
    member:{
    },
      avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  }
})
