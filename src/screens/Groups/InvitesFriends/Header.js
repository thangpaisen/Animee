import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";

const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
            <Icon name="chevron-back" size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.textHeader} numberOfLines={1}>Mời mọi người</Text>
      </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textHeader: {
    flex:1,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal:10,
  },
})
