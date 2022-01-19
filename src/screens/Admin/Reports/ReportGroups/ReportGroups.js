import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import ItemReportGroups from "./ItemReportGroups";

const ReportGroups = () => {
    const [listReportGroups, setListReportGroups] = useState([])
    useEffect(() => {
        const unsubscribe = firestore().collection('groups').where('report', '!=', []).onSnapshot(querySnapshot => {
            let list = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setListReportGroups(list);
        })
        return () => unsubscribe();
    }, [])
    return (
        <View style={styles.container}>
            {listReportGroups.map((item, index) => {
                return <ItemReportGroups key={item.id} item={item}/>
            })}
        </View>
    )
}

export default ReportGroups

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})
