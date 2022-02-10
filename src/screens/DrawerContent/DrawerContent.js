import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
  Share,
  AppState,
  Alert,
} from 'react-native';
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {getUser, setUser} from '../../redux/actions/user';
import {showInterstitialAd} from '../../firebase/Admob';
const DrawerContent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  useEffect(() => {
    const unsubscribe = dispatch(getUser());
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    admob()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
      });
  }, []);
  const handleOnLogout = async () => {
    auth()
      .signOut()
      .then(() => {})
      .catch(error => {});
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        contentContainerStyle={{paddingTop: 0}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar
              rounded
              source={{
                uri:
                  user?.imageAvatar ||
                  'https://avatarfiles.alphacoders.com/962/thumb-96289.gif',
              }}
              size={70}
            />
            <Text style={styles.name}>{user?.displayName}</Text>
            <Text style={styles.email}>Email: {user?.email}</Text>
            <View style={styles.follower}>
              <Text style={{fontSize: 16, marginRight: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {user?.follow?.length}{' '}
                </Text>
                Đang theo đõi
              </Text>
              <Text style={{fontSize: 16, marginRight: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {user?.follower?.length}{' '}
                </Text>
                Người theo đõi
              </Text>
            </View>
          </View>
          <View style={styles.drawerSection}>
            <DrawerItem
              style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
              icon={({color, size}) => (
                <Icon name="receipt-outline" color={color} size={size} />
              )}
              label={({focused, color}) => (
                <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                  Hồ sơ
                </Text>
              )}
              onPress={() => {
                navigation.navigate('ProfileUser', {
                  uidUser: auth().currentUser.uid,
                });
              }}
            />
            <DrawerItem
              style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
              icon={({color, size}) => (
                <Icon name="people-outline" color={color} size={size} />
              )}
              label={({focused, color}) => (
                <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                  Nhóm
                </Text>
              )}
              onPress={() => {
                navigation.navigate('Groups');
              }}
            />
            <DrawerItem
              style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
              icon={({color, size}) => (
                <Icon name="notifications-outline" color={color} size={size} />
              )}
              label={({focused, color}) => (
                <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                  Thông báo
                </Text>
              )}
              onPress={() => {
                navigation.navigate('Notification');
              }}
            />
            {/* Quản lý*/}
            {user?.role == 'Admin' && (
              <>
                <DrawerItem
                  style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
                  icon={({color, size}) => (
                    <Icon name="person-outline" color={color} size={size} />
                  )}
                  label={({focused, color}) => (
                    <Text
                      style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                      Quản lý người dùng
                    </Text>
                  )}
                  onPress={() => {
                    navigation.navigate('UsersManagement');
                  }}
                />
                <DrawerItem
                  style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
                  icon={({color, size}) => (
                    <Icon
                      name="information-circle-outline"
                      color={color}
                      size={size}
                    />
                  )}
                  label={({focused, color}) => (
                    <Text
                      style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                      Bị báo cáo
                    </Text>
                  )}
                  onPress={() => {
                    navigation.navigate('Reports');
                  }}
                />
              </>
            )}
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <View style={styles.welcome}>
          <Text
            style={{
              color: '#555',
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Animee
          </Text>
        </View>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="help-circle-outline" color={color} size={size} />
          )}
          label={({focused, color}) => (
            <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
              Giúp đỡ và phản hồi
            </Text>
          )}
          onPress={() => Linking.openURL('mailto:thangpaisen@gmail.com')}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="share-social-outline" color={color} size={size} />
          )}
          label={({focused, color}) => (
            <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
              Chia sẻ
            </Text>
          )}
          onPress={() =>
            Share.share({
              message: 'DownLoad and experience App on ....',
            })
          }
        />
        <DrawerItem
          style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
          icon={({color, size}) => (
            <Icon name="exit-outline" color={color} size={size} />
          )}
          label={({focused, color}) => (
            <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
              Đăng xuất
            </Text>
          )}
          onPress={() => {
            handleOnLogout();
          }}
        />
      </View>
    </View>
  );
};

export default DrawerContent;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    padding: 20,
    // alignItems: 'center',
  },
  name: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    // marginTop: 10,
    color: 'gray',
  },
  follower: {
    flexDirection: 'row',
    marginTop: 10,
  },
  drawerSection: {},
  welcome: {
    padding: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});
