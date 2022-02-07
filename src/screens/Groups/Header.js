import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { Avatar } from 'react-native-elements';
import {useSelector} from 'react-redux'
const Header = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.user.data);
    return (
        <View style={styles.header}>
        <Avatar
            size={34}
            rounded
            source={{
              uri:
                user?.imageAvatar
            }}
            onPress={() => navigation.openDrawer()}
          />
        <Text style={styles.textHeader}>Nhóm</Text>
        <TouchableOpacity
            onPress={() => navigation.navigate('Search',{type: 'group'})}
          >
            <Icon name="search" size={30} color={'black'} />
          </TouchableOpacity>
      </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
     padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    backgroundColor: 'white',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
