import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StatusBar,
  Pressable,
  ToastAndroid,
  Linking,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import imgBr from '../../assets/images/bgr.jpg';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {CheckBox} from 'react-native-elements';

const validateEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const SignIn = ({navigation}) => {
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkService, setCheckService] = useState(false);

  function handleOnPressLogin() {
    if (!email.trim()) {
      Alert.alert('Thông báo', 'Bạn chưa nhập Email');
    } else if (!validateEmail(email?.trim()))
      Alert.alert('Thông báo', 'Email không hợp lệ');
    else if (password?.trim()?.length < 6)
      Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 6 ký tự');
    else if (!checkService) {
      Alert.alert('Thông báo', 'Bạn chưa đồng ý với các điều khoản sử dụng');
    } else {
      loginUser(email?.trim(), password?.trim());
    }
  }
  function loginUser(email, password) {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        ToastAndroid.show('Đăng nhập thành công!', ToastAndroid.SHORT);
        setLoading(false);
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/wrong-password':
            setErrorMessagePassword('Mật khẩu không đúng');
            break;
          case 'auth/user-not-found':
            setErrorMessageEmail('Tài khoản không tồn tại');
            break;
          case 'auth/user-disabled':
            setErrorMessageEmail('Tài khoản đã bị khoá');
            break;
          case 'auth/network-request-failed':
            ToastAndroid.show(
              'Đăng nhập thất bại! Kiểm tra kết nối Internet',
              ToastAndroid.SHORT,
            );
            break;
          default:
            ToastAndroid.show('Lỗi', ToastAndroid.SHORT);
            break;
        }
        setLoading(false);
      });
  }
  return (
    <ImageBackground
      style={styles.loginContainer}
      source={imgBr}
      resizeMode="cover">
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
      <View style={{flex: 3}}></View>
      <View style={styles.main}>
        <View style={styles.title}>
          <Text style={styles.footerTitle}>Welcome Animee</Text>
          <Text style={styles.footerTitle2}>Đăng nhập tài khoản</Text>
        </View>
        <View style={styles.action}>
          <Input
            value={email}
            label="Email"
            labelStyle={{fontWeight: '500', fontSize: 16}}
            placeholder="Nhập Email vào...."
            leftIcon={<Icon name="mail" size={20} color="gray" />}
            style={styles.input}
            inputContainerStyle={{borderBottomWidth: 0.5}}
            errorStyle={{color: 'red', marginLeft: 0}}
            errorMessage={errorMessageEmail}
            onChangeText={text => {
              setEmail(text);
              setErrorMessageEmail('');
            }}
          />
          <Input
            value={password}
            label="Password"
            secureTextEntry={secureTextEntry}
            labelStyle={{fontWeight: '500', fontSize: 16}}
            placeholder="Nhập Password vào...."
            leftIcon={<Icon name="lock-closed" size={20} color="gray" />}
            rightIcon={
              <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)}>
                <Icon
                  name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="gray"
                />
              </Pressable>
            }
            style={styles.input}
            inputContainerStyle={{borderBottomWidth: 0.5}}
            errorStyle={{color: 'red', marginLeft: 0}}
            errorMessage={errorMessagePassword}
            onChangeText={text => {
              setPassword(text);
              setErrorMessagePassword('');
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          disabled={loading ? true : false}
          onPress={handleOnPressLogin}>
          <Text style={styles.textButton}>Đăng nhập</Text>
        </TouchableOpacity>
        <View style={styles.secureTextEntry}>
          <CheckBox
            title=""
            onPress={() => setCheckService(!checkService)}
            checked={checkService}
            containerStyle={styles.checkboxContainer}
          />
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                marginRight: 4,
              }}>
              Đồng ý
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://pages.flycricket.io/animee/terms.html',
                );
              }}>
              <Text
                style={{
                  color: 'blue',
                  fontSize: 16,
                }}>
                {' '}
                Điều khoản sử dụng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.signup}>
          <Text style={{fontSize: 14}}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupNow}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    flex: 5,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 1,
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 20,
  },
  footerTitle: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerTitle2: {
    paddingVertical: 10,
    marginLeft: 10,
    color: 'gray',
  },
  loginUsingMedia: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    borderWidth: 0,
    borderBottomColor: 'transparent',
  },
  signup: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupNow: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1394f0',
    textDecorationLine: 'underline',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#5cfff2',
    padding: 10,
    borderRadius: 20,
  },
  textButton: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkboxContainer: {
    backgroundColor: 'white',
    borderWidth: 0,
    padding: 0,
  },
  secureTextEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
