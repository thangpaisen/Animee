import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import Colors from "./../../../assets/themes/Colors";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ItemYourInvites = ({item}) => {
    const [group, setGroup] = React.useState({});
    const [user, setUser] = React.useState({});
    useEffect(() => {
        firestore().collection('users').doc(item.idUserInvite).get().then(doc => {
            setUser(doc.data());
        })
        firestore().collection('groups').doc(item.idGroup).get().then(doc => {
            setGroup(doc.data());
        })
    }, [])
    const handleOnJoin = () => {
        if(!(group.members.includes(auth().currentUser.uid))){
            firestore().collection('groups').doc(item.idGroup).update({
                members: firestore.FieldValue.arrayUnion(auth().currentUser.uid)
            })
            firestore().collection('groups').doc(item?.idGroup).collection('member')
            .doc(auth().currentUser.uid).set({
                uid: auth().currentUser.uid,
                role:'member',
                createdAt: new Date().getTime(),
            })
            .then(() => {
            ToastAndroid.show('Bạn đã tham gia nhóm', ToastAndroid.SHORT);
          });
        }
        else ToastAndroid.show('Bạn Đã tham gia nhóm này', ToastAndroid.SHORT);
        firestore().collection('users').doc(auth().currentUser.uid).collection('inviteGroup').doc(item.id).delete();  
    }
    const handleOnRemove = () => {
        firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('inviteGroup')
      .doc(item?.id)
      .delete();
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('notifications')
      .doc(item?.id)
      .delete();
        ToastAndroid.show('Đã xoá lời mời', ToastAndroid.SHORT);
    }
  return (
    <View style={styles.itemYourInvites}>
      <View style={styles.group}>
        <Image
          source={{
            uri:
              group?.imageCover ||
              'https://images6.alphacoders.com/102/1029037.jpg',
          }}
          style={styles.imageCover}
        />
        <View style={{
            paddingHorizontal: 10,
            flex: 1,
        }}>
        <View style={styles.descriptionGroup}>
          <Text style={styles.nameGroup}>{group?.name || 'Nhóm nào đó'}</Text>
          <Text style={styles.nameUserInvite}>{user?.displayName || 'Ai đó'} đã mời bạn tham gia</Text>
        </View>
        <View style={styles.btnChoice}>
          <TouchableOpacity style={styles.itemBtnChoice}
            onPress={() => handleOnJoin() }
          >
            <Text style={styles.textBtnChoice}>Tham gia nhóm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemBtnChoice,{backgroundColor:Colors.border}]}
            onPress={() => handleOnRemove() }
          >
            <Text style={[styles.textBtnChoice,{color:'black'},]}>Xoá lời mời</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
  );
};

export default ItemYourInvites;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  itemYourInvites: {
    marginTop: 20,
  },
  imageCover: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  group:{
      flexDirection: 'row',
  },
  descriptionGroup:{

  },
  nameGroup:{
      fontSize:16,
      fontWeight: 'bold',
  },
  nameUserInvite:{
      color:'gray',
      marginTop:4
  },
  btnChoice:{
      marginTop:10,
      flexDirection: 'row',
  },
  itemBtnChoice:{
      marginRight:10,
      paddingHorizontal:20,
      paddingVertical:6,
      backgroundColor:'#158dcf',
      borderRadius:10,
  },
  textBtnChoice:{
      fontSize:14,
      fontWeight: 'bold',
      color: 'white'
  }
});
