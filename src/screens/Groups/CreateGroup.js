import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import auth from "@react-native-firebase/auth";

const CreateGroup = () => {
    const navigation = useNavigation();
  const [dataGroup, setDataGroup] = useState({
    name: '',
    description: '',
  });
  const [disabledButton, setDisabledButton] = useState(true);
  const [loadingCreateGroup, setLoadingCreateGroup] = useState(false);
  const handleCreateGroup =()=>{
    setLoadingCreateGroup(true);
    firestore().collection('groups').add({
        name: dataGroup.name,
        description: dataGroup.description,
        imageCover:'https://i.ibb.co/2qCk8fX/gr.png',
        members: [auth().currentUser.uid],
        createdAt: new Date().getTime(),
        author: auth().currentUser.uid,
        managers: [auth().currentUser.uid],
        report: [],
        isBlocked: false,
    }).then((res)=>{
        firestore().collection('groups').doc(res._documentPath._parts[1]).collection('member').doc(auth().currentUser.uid).set({
            uid: auth().currentUser.uid,
            role: 'admin',
            createdAt: new Date().getTime(),
        }).then(()=>{
            setLoadingCreateGroup(false);
            navigation.replace('DetailGroup', {id: res._documentPath._parts[1]});
        })
    })
    .catch((err)=>{
            ToastAndroid.show('Có lỗi xảy ra', ToastAndroid.SHORT);
            setLoadingCreateGroup(false);
        })
  }
  return (
      <>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}
            onPress={() => {
                navigation.goBack();
            }}
        >
          <Icon name="close" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tạo nhóm</Text>
        <Icon name="close" size={30} color="transparent" />
      </View>
      <View style={styles.body}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Tên</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setDataGroup({...dataGroup, name: text});
              if (dataGroup.description.length > 0 && text.trim().length > 0)
                setDisabledButton(false);
              else setDisabledButton(true);
            }}
            value={dataGroup.name}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Mô tả</Text>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={text => {
              setDataGroup({...dataGroup, description: text});
              if (text.trim().length > 0 && dataGroup.name.length > 0)
                setDisabledButton(false);
              else setDisabledButton(true);
            }}
            value={dataGroup.description}
          />
        </View>
      </View>
      <Button
        buttonStyle={styles.buttonCreate}
        titleStyle={styles.buttonCreateTitle}
        disabled={disabledButton}
        onPress={() => handleCreateGroup()}
        title={'Tạo'}
      />
    </View>
    <Modal
        animationType="slide"
        transparent={true}
        visible={loadingCreateGroup}
      >
        <View style={styles.model}>
                <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    marginTop: 10,
  },
  inputContainer: {
    padding: 10,
  },
  inputText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonCreate: {
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: '#09bff2',
  },
  buttonCreateTitle: {
    fontSize: 16,
  },
  model:{
      flex: 1,
      backgroundColor: 'white',
      opacity: 0.4,
      justifyContent:'center',
      alignItems: 'center',
  }
});
