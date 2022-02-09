import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Linking,
} from 'react-native';
import Colors from './../../../../assets/themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const SettingsGroup = ({route}) => {
  const {group} = route?.params;
  const navigation = useNavigation();
  const handleClickButtonLeaveGroup = () => {
    Alert.alert(
      'Thông báo',
      'Bạn là quản trị viên của nhóm sau khi bạn rời đi nhóm sẽ không còn quản trị viên, Bạn chắc chắn muốn rời khỏi nhóm',
      [
        {
          text: 'Cancel',
          // onPress: () => setModalVisible(false),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleOnLeaveGroup()},
      ],
    );
  };
  const handleOnLeaveGroup = () => {
    firestore()
      .collection('groups')
      .doc(group.id)
      .update({
        managers: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
        members: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(group.id)
          .collection('member')
          .doc(auth().currentUser.uid)
          .delete()
          .then(() => {
            navigation.navigate('Groups');
            ToastAndroid.show('Bạn đã rời khỏi nhóm', ToastAndroid.SHORT);
          });
      })
      .catch(err => {
        ToastAndroid.show('Lỗi', ToastAndroid.SHORT);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.textHeader}>Cài đặt nhóm</Text>
      </View>
      <View style={styles.body}>
        {group?.isBlocked ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                alignItems: 'center',
                color: 'red',
              }}>
              Nhóm bị khóa
            </Text>
            <TouchableOpacity
              style={styles.btnMailSupport}
              onPress={() => Linking.openURL('mailto:thangpaisen@gmail.com')}>
              <Icon name="mail-outline" size={24} color={'black'} />
              <Text style={{marginLeft: 10}}>Liện Hệ Admin</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemBody}>
            <Text style={styles.textItemBody}>Cần xem xét</Text>
            <View style={styles.settingsContent}>
              <TouchableOpacity
                style={styles.itemSettings}
                onPress={() =>
                  navigation.navigate('ReportPostsGroup',{uidGroup: group.id})
                }>
                <Icon name="people-outline" size={20} color={'black'} />
                <Text style={styles.textItemSettings}>Bài viết bị báo cáo</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.textItemBody}>Cài đặt</Text>
            <View style={styles.settingsContent}>
              <TouchableOpacity
                style={styles.itemSettings}
                onPress={() =>
                  navigation.navigate('UpdateDescGroup', {group: group})
                }>
                <Icon name="ios-settings" size={20} color={'black'} />
                <Text style={styles.textItemSettings}>
                  Chỉnh sửa thông tin nhóm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.itemSettings}
                onPress={() =>
                  navigation.navigate('MembersGroup', {dataGroup: group})
                }>
                <Icon name="people-outline" size={20} color={'black'} />
                <Text style={styles.textItemSettings}>Quản lý thành viên</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.itemBody}>
          <Text style={styles.textItemBody}>Hỗ trợ</Text>
          <View style={styles.supportContent}>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportItemIcon}>
                <Icon name="arrow-redo-outline" size={28} color={'black'} />
              </View>
              <Text style={styles.textSupportItem}>Chia sẻ nhóm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.supportItem}
              onPress={() => handleClickButtonLeaveGroup()}>
              <View style={styles.supportItemIcon}>
                <Icon name="log-out-outline" size={28} color={'black'} />
              </View>
              <Text style={styles.textSupportItem}>Rời khỏi nhóm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SettingsGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background2,
  },
  header: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textHeader: {
    flex: 1,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 10,
  },
  body: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  itemBody: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d1d1',
    padding: 10,
  },
  textItemBody: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  settingsContent: {
    marginTop: 10,
  },
  itemSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textItemSettings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  supportContent: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
  },
  supportItem: {
    alignItems: 'center',
    width: 100,
  },
  supportItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSupportItem: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnMailSupport: {
    marginTop: 10,
    flexDirection: 'row',
    padding: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
