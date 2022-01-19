import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,ScrollView,FlatList } from 'react-native'
import Header from "./Header"
import Search from "./Search";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import ItemUser from "./ItemUser";
import Loading from "./../../../components/Loading";
import Nodata from "./../../../components/Nodata";
import { useSelector } from "react-redux";
const UsersManagement = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const [showData, setShowData] = useState(false);
    const [listUsers, setListUsers] = useState([])
    const [listUsersSearch, setListUsersSearch] = useState([])
    useEffect(() => {
        const unsubscribe = firestore().collection('users').onSnapshot((querySnapshot) => {
            const listUsers = [];
            querySnapshot.forEach((doc) => {
                listUsers.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setListUsers(listUsers);
        });
        return () => {
              unsubscribe()  
        }
    }, [])
    const handleOnSearch = value => {
        setShowData(true);
        setLoading(true);
        firestore()
        .collection('users').get()
        .then(querySnapshot => {
            var listUser = [];
            querySnapshot.forEach(doc => {
                    if (
                    doc.data().displayName.toUpperCase().includes(value.toUpperCase())
                    )
                    listUser.push({...doc.data(),id:doc.id});
            });
            setListUsersSearch(listUser);
            setLoading(false);
        });
    };
    const handleOnHideData = value => {
        setShowData(false);
    };
    return (
        <View style={styles.container}>
            <Header title={'Quản lý người dùng'}/>
            <Search handleOnHideData={handleOnHideData} handleOnSearch={handleOnSearch}/>
            {showData?
            loading?<Loading/>:listUsersSearch.length==0?<Nodata/>
            :<ScrollView style={styles.listUsers}>
                {
                    listUsersSearch.map((item) => 
                        <ItemUser item={item} key={item.id}/>)
                }
            </ScrollView>
            :<ScrollView style={styles.listUsers}>
                <Text style={styles.headerListUsers}>Danh sách người dùng</Text>
                {
                    listUsers.map((item) => 
                        <ItemUser item={item} key={item.id}/>)
                }
            </ScrollView>
            }
        </View>
    )
}

export default UsersManagement

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listUsers:{
        paddingHorizontal:20,
    },
    headerListUsers:{
        marginTop:20,
        fontSize: 20,
        fontWeight: 'bold',
    }
})
