import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from "./../../../assets/themes/Colors";
import Header from "./Header";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import ItemGroupLeave from "./ItemGroupLeave";
const Membership = () => {
    const [myGroups, setMyGroups] = useState([]);
    useEffect(() => {
        const sub = firestore()
        .collection('groups')
        .where('members', 'array-contains', auth().currentUser.uid)
        .onSnapshot(querySnapshot => {
            setMyGroups(
            querySnapshot.docs.map(item => ({...item.data(), id: item.id})),
            );
        });
        return () => {
        sub();
        };
    }, []);
    return (
        <View style={styles.container}>
            <Header/>
            {myGroups.length?<View style={styles.content}>
                {myGroups.map(item => (
                    <ItemGroupLeave key={item.id} item={item}/>
                ))}
            </View>
            :<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>Bạn chưa tham gia nhóm nào</Text>
            </View>}
        </View>
    )
}

export default Membership

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.background,
    },
    content:{
        padding:20,
    }
})
