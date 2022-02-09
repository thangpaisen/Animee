import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Avatar} from 'react-native-elements';
import Lightbox from 'react-native-lightbox-v2';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import dateFormat from 'dateformat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import { timeSince } from "./../../../../../utils/fomattime";
const ContentPost = ({item}) => {
  const navigation = useNavigation();
  const [userItemPost, setUserItemPost] = useState({});
  useEffect(() => {
    const sub = firestore()
      .collection('users')
      .doc(item.uidUser)
      .onSnapshot(doc => {
        setUserItemPost({
          id: doc.id,
          ...doc.data(),
        });
      });
    return () => sub();
  }, []);
  return (
    <>
      <View style={styles.itemPost}>
        <View style={styles.headerItemPost}>
          <Avatar
            size={34}
            rounded
            source={{
              uri:
                userItemPost?.imageAvatar
            }}
          />
          <View style={styles.title}>
            <TouchableOpacity
              >
              <Text style={styles.name}>{userItemPost.displayName}</Text>
            </TouchableOpacity>
            <Text style={styles.lastTime}>
              {timeSince(item?.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          {item?.message?.text.length > 0 && (
            <Text
              style={[
                styles.textContent,
                !item?.message?.image && {fontSize: 20},
              ]}>
              {item?.message.text}
            </Text>
          )}
          {item?.message?.image ? (
            <Lightbox
              navigator={navigation.navigator}
              activeProps={{
                style: {
                  flex: 1,
                  width: width,
                  height: height,
                  resizeMode: 'contain',
                },
              }}>
              <Image source={{uri: item?.message.image}} style={styles.image} />
            </Lightbox>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default ContentPost;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  itemPost: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 6,
    borderBottomColor: '#e3e3e3',
  },
  headerItemPost: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  lastTime: {
    fontSize: 12,
  },
  content: {
    marginVertical: 10,
  },
  textContent: {
    padding: 10,
    fontSize: 16,
  },
  image: {
    width: width,
    height: height / 2,
  },
});
