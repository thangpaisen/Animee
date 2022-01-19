import React,{useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Header from './Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
const MyGroups = ({route}) => {
    const navigation = useNavigation();
    const {myGroups} = route.params;
    const [myGroupsManages,setMyGroupsManages] = useState([])
    useEffect(() => {
        setMyGroupsManages(myGroups.filter(group => group.managers.includes(auth().currentUser.uid)));
    }, [])
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {myGroupsManages.length >0&&<View style={styles.myGroupsManages}>
          <Text style={styles.headerMyGroupsManages}>
            Nhóm của bạn quản lý
          </Text>
            {
                myGroupsManages.map((item, index) => {
                    return (
                        <TouchableOpacity style={styles.item} key={item.id}
                            onPress={() => {navigation.navigate('DetailGroup',{id:item.id})} }
                        >
                            <Image
                                source={{
                                    uri:
                                    item.imageCover ||
                                    'https://images6.alphacoders.com/102/1029037.jpg',
                                }}
                                style={styles.imageCover}
                                />
                            <Text style={styles.name}>{item?.name}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>}
        <View style={styles.myGroupsManages}>
          <Text style={styles.headerMyGroupsManages}>
            Tất cả
          </Text>
            {
                myGroups.map((item, index) => {
                    return (
                        <TouchableOpacity style={styles.item} key={item.id}
                            onPress={() => {navigation.navigate('DetailGroup',{id:item.id})} }
                        >
                            <Image
                                source={{
                                    uri:
                                    item.imageCover ||
                                    'https://images6.alphacoders.com/102/1029037.jpg',
                                }}
                                style={styles.imageCover}
                                />
                            <Text style={styles.name}>{item?.name}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
      </View>
    </View>
  );
};

export default MyGroups;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  myGroupsManages: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderBottomWidth:6,
    borderBottomColor: '#e3e3e3',
    },
    headerMyGroupsManages: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
  item: {
      paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:0.3,
    borderBottomColor: '#e3e3e3',
    },
    imageCover: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    name: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },

});
