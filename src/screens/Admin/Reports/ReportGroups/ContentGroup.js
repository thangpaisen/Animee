import React from 'react'
import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import { useNavigation } from "@react-navigation/native";
const ContentGroup = ({item}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.contentGroup}
        onPress={()=>
            navigation.navigate('StackGroups', {
                  screen: 'DetailGroup',
                  params: {
                    id: item.id,
                  },
                })}
        >
            <Image source={{uri: item?.imageCover}} style={styles.imageCover} />
            <Text style={styles.nameGroup}>{item?.name}</Text>
        </TouchableOpacity>
    )
}

export default ContentGroup

const styles = StyleSheet.create({
    contentGroup:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingVertical: 10,
        borderBottomWidth: 6,
        borderBottomColor: '#e3e3e3',
    },
    imageCover:{
        width: 40,
        height: 40,
        borderRadius:6,
    },
    nameGroup:{
        fontSize: 16,
        marginLeft: 20,
        fontWeight: 'bold',
    }
})
