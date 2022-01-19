import React from 'react'
import { View, Text,StyleSheet ,Pressable,TouchableOpacity} from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
const Header = ({handleOnSave}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={{fontSize:18,fontWeight: 'bold',flex:1,paddingHorizontal:10,}} numberOfLines={1}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity onPress={() => handleOnSave()}>
          <Text style={{fontSize:16,fontWeight:'bold'}}>Lưu</Text>
        </TouchableOpacity>
      </View>
    )
}

export default Header
const styles = StyleSheet.create({
    header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    backgroundColor: 'white'
  },
})

