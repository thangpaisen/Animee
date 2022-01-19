import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
const ContentUser = ({item}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
              style={styles.itemUser}
              onPress={() => {
                navigation.navigate('ProfileUser', {uidUser: item?.uid});
              }}>
              <Avatar
                source={{
                  uri:
                    item?.imageAvatar
                }}
                size={45}
                rounded
                containerStyle={{}}
              />
              <View style={{marginLeft: 10,flex:1}} >
                <Text style={{fontSize: 16, fontWeight: 'bold'}} numberOfLines={1}>
                  {item?.displayName || 'Người dùng ... '}
                </Text>
                <Text style={{fontSize: 14}} numberOfLines={1}>{item?.email}</Text>
              </View>
        </TouchableOpacity>
    )
}

export default ContentUser

const styles = StyleSheet.create({
    itemUser: {
    padding: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 6,
    borderBottomColor: '#e3e3e3',
  },
})
