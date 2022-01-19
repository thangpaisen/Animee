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

const UpdateDescGroup = ({route}) => {
    const {group} = route?.params;
    const navigation = useNavigation();
  const [dataGroup, setDataGroup] = useState({
    name: group.name,
    description: group.description,
  });
  const [disabledButton, setDisabledButton] = useState(true);
  const [loadingCreateGroup, setLoadingCreateGroup] = useState(false);
  const handleCreateGroup =()=>{
    if(dataGroup.name !== group.name || dataGroup.description !== group.description){

    setLoadingCreateGroup(true);
    firestore().collection('groups').doc(group.id).update({
        name: dataGroup.name,
        description: dataGroup.description,
        updateAt: new Date().getTime(),
    }).then((res)=>{
        setLoadingCreateGroup(false);
        navigation.replace('DetailGroup', {id: group.id});
        ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
    })
    .catch((err)=>{
            ToastAndroid.show('Có lỗi xảy ra', ToastAndroid.SHORT);
            setLoadingCreateGroup(false);
        })
    }
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
        <Text style={styles.headerText}>Cập nhật thông tin nhóm</Text>
        <Icon name="close" size={30} color="transparent" />
      </View>
      <View style={styles.body}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Tên</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setDataGroup({...dataGroup, name: text});
              if(text.trim() == group.name && dataGroup.description == group.description) 
                setDisabledButton(true);
              else if(dataGroup.description.length > 0 && text.trim().length > 0)
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
              if(text.trim() == group.description && dataGroup.name == group.name) 
                setDisabledButton(true);
              else if(text.trim().length > 0 && dataGroup.name.length > 0)
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
        title={'Cập nhật'}
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

export default UpdateDescGroup;

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
