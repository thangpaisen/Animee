import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,Modal,ToastAndroid,Pressable,TouchableOpacity} from 'react-native'
import Header from "./Header"
import ItemYourInvites from "./ItemYourInvites";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Nodata from "./../../components/Nodata";
import ItemUserFollower from "./ItemUserFollower";
import Icon from 'react-native-vector-icons/Ionicons'
import ItemUserLovePost from "./ItemUserLovePost";
import ItemUserCommentPost from "./ItemUserCommentPost";
import Loading from "./../../components/Loading";
const Notification = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true);
        const sub = firestore().collection('users').doc(auth().currentUser.uid).collection('notifications')
        .orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
            setData(querySnapshot.docs.map(doc => ({id: doc.id,...doc.data()})))
            setLoading(false);
            })
        return () => {
            sub()
        }
    }, [])
    const handleClickButtonDelete = (id) => {
        firestore().collection('users').doc(auth().currentUser.uid)
        .collection('notifications').doc(id).delete()
        .then(() => {
            ToastAndroid.show('Đã gỡ thông báo', ToastAndroid.SHORT)
        })
        .catch(() => {
            ToastAndroid.show('Lỗi', ToastAndroid.SHORT)
        })
    }
    return (
        <View style={styles.container}>
            <Header/>
            {loading?<Loading/>:
            (data.length > 0 ?
            <View style={styles.content}>
                {data.map(item => 
                    {
                        if(item.type === 'inviteGroup'){
                            return <ItemYourInvites key={item.id} item={item} handleClickButtonDelete={handleClickButtonDelete}/>
                        }
                        else if(item.type === 'Follower'){
                            return <ItemUserFollower key={item.id} item={item} handleClickButtonDelete={handleClickButtonDelete}/>
                        }
                        else if(item.type === 'Love'){
                            return <ItemUserLovePost key={item.id} item={item} handleClickButtonDelete={handleClickButtonDelete}/>
                        }
                        else if(item.type === 'Comment'){
                            return <ItemUserCommentPost key={item.id} item={item} handleClickButtonDelete={handleClickButtonDelete}/>
                        }
                    })}
            </View>
            :<Nodata title={'Không có thông báo nào'}/>)}
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
    },
    content:{
        marginTop: 10,
    },
    
})
