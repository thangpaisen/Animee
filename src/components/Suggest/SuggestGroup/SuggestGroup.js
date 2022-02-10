import { StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native'
import React,{useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import ItemGroupSuggest from './ItemGroupSuggest'
import firestore from '@react-native-firebase/firestore';
const SuggestGroup = () => {
    const [data, setData] = useState([])
    const [hide, setHide] = useState(false)
    const me = useSelector(state => state.user.data);
    useEffect(() => {
      firestore().collection('groups').get()
      .then(querySnapshot => {
        let list = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
        .filter(doc => doc.members.includes(me.uid) === false);
        setData(list);
      })
    },[])
  if(data.length ===0) return null
  if(hide) return null
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.textTitle}>Những nhóm bạn có thể biết</Text>
        <TouchableOpacity style={styles.buttonHide} onPress={() => setHide(true)}>
          <Text style={styles.textHide}>Ẩn</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <ItemGroupSuggest item={item}/>}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default SuggestGroup

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitle:{
    marginVertical:10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonHide:{
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#e3e3e3',
  },
  textHide:{
    color: '#000',
    fontWeight: 'bold',
  },
})