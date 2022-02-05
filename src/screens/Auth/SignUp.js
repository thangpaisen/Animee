import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import imgBr from '../../assets/images/bgr.jpg';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const validateEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessageName, setErrorMessageName] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  function handleOnPressLogin() {
    if (name.trim().length < 6) setErrorMessageName('Name is a required field');
    if (!validateEmail(email.trim()))
      setErrorMessageEmail('Email must be a valid email');
    if (password.trim()?.length < 6)
      setErrorMessagePassword('Password must be at least 6 characters');
    if (
      validateEmail(email.trim()) &&
      password.trim()?.length >= 6 &&
      name.trim()?.length >= 6
    )
      registerUser(name.trim(), email.trim(), password.trim());
  }

  function registerUser(name, email, password) {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        ToastAndroid.show('Đăng ký thành công!', ToastAndroid.SHORT);
        updateProfileUser(name);
        setLoading(false);
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setErrorMessageEmail('Tài khoản đã tồn tại');
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
  function updateProfileUser(name) {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .set({
        uid: auth().currentUser.uid,
        displayName: name,
        description: '',
        imageAvatar: 'https://image.flaticon.com/icons/png/512/149/149071.png',
        imageCover: 'https://image.flaticon.com/icons/png/512/149/149071.png',
        email: auth().currentUser.email,
        follow: ['oKn3cVIKArgZbXihWUh9ZO4xWX52'],
        follower: [],
        role: 'User',
        isBlocked: false,
        report: [],
        createdAt: new Date().getTime(),
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
      <View style={{flex: 2}}></View>
      <View style={styles.main}>
        <View style={styles.title}>
          <Text style={styles.footerTitle}>Create an account</Text>
          <Text style={styles.footerTitle2}>Đăng ký tài khoản</Text>
        </View>
        <View style={styles.action}>
          <Input
            value={name}
            label="Name"
            labelStyle={{fontWeight: '500', fontSize: 16}}
            placeholder="Nhập tên vào...."
            leftIcon={<Icon name="person" size={20} color="gray" />}
            style={styles.input}
            inputContainerStyle={{borderBottomWidth: 0.5}}
            errorStyle={{color: 'red', marginLeft: 0}}
            errorMessage={errorMessageName}
            onChangeText={text => {
              setName(text);
              setErrorMessageName('');
            }}
          />
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
          <Text style={styles.textButton}>Đăng ký</Text>
        </TouchableOpacity>
        <View style={styles.signup}>
          <Text style={{fontSize: 14}}>Bạn đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signupNow}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
export default SignUp;
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
});
