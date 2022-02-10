import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Header from './Header';
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-elements';
import Loading from './../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import Nodata from "./../../components/Nodata";
import ItemDataMember from "./ItemDataMember";
import ItemDataGroup from "./ItemDataGroup";
import ItemUserMessage from "./ItemUserMessage";
import Suggest from "./../../components/Suggest/Suggest";

const Search = ({route}) => {
    const type = route?.params?.type|| '';
  const navigation = useNavigation();
  const [valueSearch, setValueSearch] = useState('');
  const [listDataSearch, setListDataSearch] = useState([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOnSearch = value => {
    setShowData(true);
    setLoading(true);
    if(type==='group')
    firestore()
    .collection('groups').get()
    .then(snapshot => {
        let list = [];
        snapshot.forEach(doc => {
            if(doc.data().name.toUpperCase().includes(value.toUpperCase()))
                list.push({...doc.data(),id:doc.id});
        });
        setListDataSearch(list);
        setLoading(false);
    })
    if(type!=='group')
    firestore()
      .collection('users').get()
      .then(querySnapshot => {
        var listUser = [];
        querySnapshot.forEach(doc => {
          if (value.toUpperCase() === doc.data().email.toUpperCase())
            listUser.unshift({...doc.data(),id:doc.id});
          else if (
            doc.data().displayName.toUpperCase().includes(value.toUpperCase())
          )
            listUser.push({...doc.data(),id:doc.id});
        });
        setListDataSearch(listUser);
        setLoading(false);
      });
  };
  const handleOnHideData = value => {
    setShowData(false);
  };
  useEffect(() => {
  }, []);
  return (
    <View style={styles.container}>
      <Header
        type={type}
        handleOnSearch={handleOnSearch}
        handleOnHideData={handleOnHideData}
        valueSearch={valueSearch}
        setValueSearch={setValueSearch}
      />
      {showData ? (
        loading ? (
          <Loading />
        ) : listDataSearch.length === 0 ? (
          <Nodata/>
        ) : (
          listDataSearch.map(data => 
            {
                if(type=='user')
                    return <ItemDataMember key={data.id} data={data}/>
                else if(type =='group')
                    return <ItemDataGroup key={data.id} data={data}/>
                else if(type =='userMessage')
                    return <ItemUserMessage key={data.id} data={data}/>
            }      
          )
        )
      ) : <Suggest type={type}/>}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemUser: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },  
});
