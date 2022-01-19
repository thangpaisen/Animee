import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";

const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
        <Text style={styles.textHeader}>Nhóm</Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search',{type: 'group'})}
          >
            <Icon name="search" size={30} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth:0.3,
    borderBottomColor: '#e3e3e3',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
