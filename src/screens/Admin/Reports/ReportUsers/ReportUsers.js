import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ItemReportUsers from "./ItemReportUsers";
import firestore from '@react-native-firebase/firestore';
const ReportUsers = () => {
    const [listReportUsers, setListReportUsers] = useState([])
    useEffect(() => {
        const unsubscribe = firestore().collection('users').where('report', '!=', []).onSnapshot(querySnapshot => {
            let list = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setListReportUsers(list);
        })
        return () => unsubscribe();
    }, [])
    return (
        <View style={styles.container}>
            {listReportUsers.map((item, index) => {
                return <ItemReportUsers key={item.id} item={item}/>
            })}
        </View>
    )
}

export default ReportUsers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})
