import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import Header from './Header';
import ItemUser from './ItemUser';
const ListUserFollower = ({route}) => {
  const userProfile = route.params.userProfile;
  return (
    <View style={styles.container}>
      <Header title={'Danh sách đang theo dõi'} />
      <Text style={styles.text}>{userProfile?.follower?.length} người</Text>
      <FlatList
        data={userProfile?.follower}
        keyExtractor={item => item}
        renderItem={({item}) => <ItemUser uid={item} />}
      />
    </View>
  );
};

export default ListUserFollower;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
  },
});
