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
import ContentGroup from './ContentGroup';
const ItemReportGroups = ({item}) => {
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
  const handleOnBlockGroup = () => {
    firestore()
      .collection('groups')
      .doc(item.id)
      .update({
        isBlocked: true,
      })
      .then(() => {
        firestore()
          .collection('groups')
          .doc(item.id)
          .update({
            report: [],
          })
          .then(() => {
            ToastAndroid.show('Đã khoá nhóm thành công', ToastAndroid.SHORT);
          });
      })
      .catch(error => {
        ToastAndroid.show('Lỗi', ToastAndroid.SHORT);
      });
  };
  const handleOnClickBtnBlock = () => {
    Alert.alert(
      'Khoá nhóm',
      'Bạn có chắc chắn muốn Khoá nhóm?',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleOnBlockGroup()},
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
        <Text style={{fontSize: 16}}>đã báo cáo nhóm này.</Text>
      </View>
      <ContentGroup item={item} />
      <View style={styles.btnChoice}>
        <TouchableOpacity
          style={styles.btnChoiceItem}
          onPress={() => {
            firestore().collection('groups').doc(item.id).update({
              report: [],
            });
          }}>
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

export default ItemReportGroups;

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
