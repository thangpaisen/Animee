import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";

const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="ios-arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.textHeader}>Nhóm của bạn</Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateGroup')}>
            <Icon name="add-circle-outline" size={30} color={'#000'} />
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
