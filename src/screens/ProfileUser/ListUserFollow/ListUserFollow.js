import { StyleSheet, Text, View,FlatList } from 'react-native';
import React from 'react';
import Header from './Header';
import ItemUser from "./ItemUser";
const ListUserFollow = ({route}) => {
  const userProfile = route.params.userProfile;
  return (
    <View style={styles.container}>
      <Header title={'Danh sách người theo dõi'}/>
      <Text style={styles.text}>{userProfile?.follow?.length} người</Text>
      <FlatList
        data={userProfile?.follow}
        keyExtractor={(item) =>item}
        renderItem={({item}) => <ItemUser uid={item}/>}
      />
    </View>
  );
};

export default ListUserFollow;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
  },
  text:{
    fontSize:18,
    fontWeight:'bold',
    marginHorizontal:20,
    marginTop:10,
  },

});
