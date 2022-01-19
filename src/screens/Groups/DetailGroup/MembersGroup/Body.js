import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ItemUser from "./ItemUser";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const Body = ({idGroup,isAdmin,handleOnDeleteUser}) => {
    const [listMember, setListMember] = useState([]);
    const [listManager, setListManager] = useState([]);
    const ref =firestore().collection('groups').doc(idGroup).collection('member')
    useEffect(() => {
        const sub2 = ref.where('role', '!=','admin').onSnapshot(querySnapshot => {
            setListMember(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        })
        const sub3 = ref.where('role', '==','admin').onSnapshot(querySnapshot=>{
            setListManager(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        })
        return () => {
            sub2()
            sub3()
        }
    }, [])
    return (
        <View style={styles.body}>
            {/* <View style={styles.listManager}>
              <ItemUser data={{id:auth().currentUser.uid}}/>
            </View> */}
            <View style={styles.listManager}>
                <Text style={styles.title}>Quản trị viên nhóm</Text>
                {listManager.map((item, index)=>
                    <ItemUser data={item} key={item.id} isAdmin={false}/>
                )}
            </View>
            <View style={styles.listManager}>
                <Text style={styles.title}>Thành viên khác</Text>
                {listMember.map((item, index)=>
                    <ItemUser data={item} key={item.id} isAdmin={isAdmin} handleOnDeleteUser={handleOnDeleteUser}/>
                )}
            </View>
        </View>
    )
}

export default Body

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    listManager:{
        marginVertical:10
    },
    title:{
        paddingHorizontal:10,
        fontSize:18,fontWeight: 'bold'
    }
})
