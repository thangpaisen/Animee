import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,ScrollView } from 'react-native'
import ItemReportPost from './ItemReportPost'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ReportPost = () => {
    const [listReportPost, setListReportPost] = useState([])
    useEffect(() => {
        const unsubscribe = firestore().collection('postsUser')
        .where('report', '!=', []).onSnapshot(querySnapshot => {
            const list = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            setListReportPost(list)
        })
        return () => {
            unsubscribe()
        }
    }, [])    

    return (
        <ScrollView style={styles.container}>
            {listReportPost.map((item, index) => {
                return <ItemReportPost key={item.id} item={item}/>
            })}
        </ScrollView>
    )
}

export default ReportPost

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
    }
})
