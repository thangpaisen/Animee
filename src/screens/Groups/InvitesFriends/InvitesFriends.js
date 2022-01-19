import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,ScrollView } from 'react-native'
import Header from './Header'
import Search from "./Search";
import ItemUserInvite from "./ItemUserInvite";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loading from "./../../../components/Loading";
import Nodata from "./../../../components/Nodata";
const InvitesFriends = ({route}) => {
    const {idGroup} = route.params;
    const [showData, setShowData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listUsers, setListUsers] = useState([]);
    const [listUsersSearch, setListUsersSearch] = useState([]);
    // const ref = firestore().collection('groups').doc(idGroup);
    useEffect(() => {
        firestore().collection('users').doc(auth().currentUser.uid).get()
        .then((doc) => {
            setListUsers(doc.data().follow);
        })
    }, [])
    const handleOnSearch = value => {
    setShowData(true);
    setLoading(true);
    firestore()
      .collection('users').get()
      .then(querySnapshot => {
        var listUsersSearch = [];
        querySnapshot.docs.forEach(doc => {
            if(listUsers.includes(doc.id))
                if (doc.data().displayName.toUpperCase().includes(value.toUpperCase()))
                listUsersSearch.push(doc.data().uid);
        })
        setListUsersSearch(listUsersSearch);
        setLoading(false);
      });
  };
    const handleOnHideData = value => {
        setShowData(false);
        setLoading(false);
    };
    return (
        <View style={styles.container}>
            <Header />
            <Search
                handleOnSearch={handleOnSearch}
                handleOnHideData={handleOnHideData}
            />
            {loading?<Loading />:
            !showData?
            <ScrollView>
                {listUsers.length > 0 &&
                    listUsers.map((item, index) =>
                        <ItemUserInvite idUser={item} idGroup={idGroup} key={item}/>
                    )}
            </ScrollView>:
            listUsersSearch.length > 0?
            listUsersSearch.map((item, index) =>
                        <ItemUserInvite idUser={item} idGroup={idGroup} key={item}/>
                    )
            :<Nodata />
        }
        </View>
    )
}

export default InvitesFriends

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
    }
})
