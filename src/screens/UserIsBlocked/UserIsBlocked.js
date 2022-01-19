import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import auth from "@react-native-firebase/auth";
const UserIsBlocked = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản của bạn đã bị khoá</Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.btnSupport}
          onPress={() => {
            auth()
              .signOut()
              .then(() =>{});
          }}>
          <Text style={styles.btnSupportText}>Đăng xuất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSupport}
          onPress={() => Linking.openURL('mailto:thangpaisen@gmail.com')}>
          <Text style={styles.btnSupportText}>Hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserIsBlocked;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnSupport: {
      margin: 20,
      flex:1,
    marginTop: 10,
    backgroundColor: '#00A6FF',
    padding: 10,
    borderRadius: 5,
  },
  btnSupportText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
