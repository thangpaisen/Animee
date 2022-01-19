import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ContentUser from './ContentUser';
const ItemReportUsers = ({item}) => {
  const [usersReport, setUsersReport] = useState([]);
  useEffect(() => {
    item?.report?.forEach(item => {
      firestore()
        .collection('users')
        .doc(item)
        .get()
        .then(doc => {
          setUsersReport(usersReport => [
            ...usersReport,
            doc.data()?.displayName,
          ]);
        });
    });
  }, []);
  const handleOnBlockUser = () => {
    if (item?.role?.toUpperCase() === 'ADMIN') 
        Alert.alert('Thông báo', 'Không thể khóa tài khoản Admin'); 
    else 
    firestore()
      .collection('users')
      .doc(item.id)
      .update({
        isBlocked: true,
      })
      .then(() => {
        firestore()
          .collection('users')
          .doc(item.id)
          .update({
            report: [],
          })
          .then(() => {
            ToastAndroid.show('Đã khoá người dùng thành công', ToastAndroid.SHORT);
          });
      })
      .catch(error => {
        ToastAndroid.show('Lỗi', ToastAndroid.SHORT);
      });
  };
  const handleOnClickBtnBlock = () => {
    Alert.alert(
      'Khoá nhóm',
      'Bạn có chắc chắn muốn Khoá người dùng này?',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleOnBlockUser()},
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.itemReportPost}>
      <View style={styles.itemReportPostHeader}>
        {usersReport?.length == 1 && (
          <Text style={styles.nameUserReport}>
            {usersReport[0] || 'Ai đó'}{' '}
          </Text>
        )}
        {usersReport?.length > 1 && (
          <Text style={styles.nameUserReport}>
            {usersReport[0] || 'Ai đó'} và {usersReport.length - 1} người khác{' '}
          </Text>
        )}
        <Text style={{fontSize: 16}}>đã báo cáo người dùng này.</Text>
      </View>
      <ContentUser item={item} />
      <View style={styles.btnChoice}>
        <TouchableOpacity
          style={styles.btnChoiceItem}
          onPress={() => {
                firestore().collection('users').doc(item.id).update({
                report: [],
                });
            }}
            >
          <Text style={styles.btnChoiceItemText}>Giữ lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnChoiceItem}
          onPress={() => {
            handleOnClickBtnBlock();
          }}>
          <Text style={styles.btnChoiceItemText}>Khoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemReportUsers;

const styles = StyleSheet.create({
  itemReportPost: {},
  itemReportPostHeader: {
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 6,
    borderTopColor: '#e6e6e6',
    borderBottomWidth: 6,
    borderBottomColor: '#e6e6e6',
  },
  nameUserReport: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnChoice: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnChoiceItem: {
    flex: 1,
    marginHorizontal: 20,
    padding: 10,
    paddingVertical: 6,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
  },
  btnChoiceItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
