import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Dimensions } from 'react-native'
import {Avatar, Badge} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
const ItemUserOnline = ({item}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
              style={styles.itemFriendOnLine}
              onPress={() =>
                navigation.navigate('Messages', {uidUserReceiver: item.uid})
              }>
              <View>
                <Avatar
                  source={{
                    uri:
                      item.imageAvatar
                  }}
                  size={50}
                  rounded
                />
                <Badge
                    status="success"
                  badgeStyle={{backgroundColor: 'green',width:10,height:10,borderWidth:0}}
                  containerStyle={{position: 'absolute', bottom: 4, right: 0}}
                />
              </View>
              <Text style={styles.nameItemFriendOnLine} numberOfLines={2}>
                {item.displayName || 'ahihi'}
              </Text>
            </TouchableOpacity>
    )
}

export default ItemUserOnline
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
      itemFriendOnLine: {
    width: width / 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  nameItemFriendOnLine: {
    marginTop: 2,
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
  },
})
