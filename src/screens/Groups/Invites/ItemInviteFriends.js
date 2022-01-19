import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
const ItemInviteFriends =({item}) =>{
    const navigation = useNavigation();
  return (
    <View style={styles.inviteFriends}>
      <View style={styles.group}>
        <Image
          source={{
            uri:
              item?.imageCover ||
              'https://2.pik.vn/2021c74733ba-47de-4c99-ac6f-d968859e3f3b.png',
          }}
          style={styles.imageCover}
        />
        <View style={styles.descriptionGroup}>
            <Text style={styles.nameGroup} numberOfLines={2}>{item?.name || 'Nhóm nào đó '}</Text>
            <Text style={styles.nameUserInvite} numberOfLines={1}>
              {'Bạn đã tham gia khi nào đó'}
            </Text>
        </View>
        <TouchableOpacity style={styles.btnInvite}
            onPress={() =>navigation.navigate('InvitesFriends',{idGroup:item.id}) }
        >
            <Icon name="add" size={24} color="blue" />
            <Text style={styles.textBtnInvite}>Mời</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default ItemInviteFriends;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  inviteFriends: {
    marginTop: 20,
  },
  imageCover: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionGroup: {
      paddingHorizontal: 10,
            flex: 1,
  },
  nameGroup: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameUserInvite: {
    color: 'gray',
    marginTop: 4,
  },
  btnInvite:{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor:'#e3f2fd'
  },
  textBtnInvite:{
        fontSize: 16,
        color: 'blue',
        fontWeight: 'bold'
  }
});
