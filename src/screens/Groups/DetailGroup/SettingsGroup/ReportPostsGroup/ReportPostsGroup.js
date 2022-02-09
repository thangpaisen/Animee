import { StyleSheet, Text, View,ScrollView } from 'react-native';
import React,{useState, useEffect} from 'react';
import Header from "./../../../../../components/Header";
import ItemReportPostGroup from './ItemReportPostGroup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ReportPostsGroup = ({route}) => {
  const {uidGroup} = route.params;
  const [listReportPost, setListReportPost] = useState([])
  const refGroup = firestore().collection('groups').doc(uidGroup);
  useEffect(() => {
        const unsubscribe = refGroup.collection('posts')
        .where('report', '!=', []).onSnapshot(querySnapshot => {
            const list = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            setListReportPost(list)
        })
        return () => unsubscribe()
    }, [])
  return (
    <View style={styles.container}>
      <Header title={'Bài viết bị báo cáo'} />
      <ScrollView style={styles.container}>
            {listReportPost.map((item, index) => {
                return <ItemReportPostGroup key={item.id} item={item} refGroup={refGroup}/>
            })}
        </ScrollView>
    </View>
  );
};

export default ReportPostsGroup;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  }
});
