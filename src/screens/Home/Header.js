import React from 'react'
import { View, Text ,TouchableOpacity,StyleSheet} from 'react-native'
import {Avatar} from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons'
const Header = ({user}) => {
    const navigation= useNavigation();
    return (
        <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.textLogo}>Animee</Text>
        </View>
        <TouchableOpacity
            onPress={() => navigation.navigate('Search',{type: 'user'})}
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
    backgroundColor: 'white'
  },

  textLogo: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})
