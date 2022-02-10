import { StyleSheet, Text, View,FlatList } from 'react-native'
import React,{useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import ItemUserSuggest from './ItemUserSuggest'
import firestore from '@react-native-firebase/firestore';
const SuggestUserFollow = () => {
    const [data, setData] = useState([])
    const me = useSelector(state => state.user.data);
    useEffect(() => {
      firestore().collection('users').where('uid', '!=', me.uid).get()
      .then(querySnapshot => {
        let list = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})).filter(doc => me.follow.includes(doc.id) === false);
        setData(list);
      })
    },[])
  if(data.length ===0) return null
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Những người bạn có thể biết</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <ItemUserSuggest item={item}/>}
        keyExtractor={item => item.uid}
      />
    </View>
  )
}

export default SuggestUserFollow

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  textTitle:{
    marginVertical:10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  }
})