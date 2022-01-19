import React,{useState,useEffect} from 'react';
import {StyleSheet, Text, View, Pressable, TextInput,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {useDispatch} from 'react-redux'
const Header = ({type,handleOnSearch,handleOnHideData,setValueSearch,valueSearch}) => {
    const navigation = useNavigation();
    // const dispatch = useDispatch();
    const [value, onChangeText] = useState('');
  return (
    <View style={styles.container}>
            <View style={styles.containerSearch}>
                <TouchableOpacity
                 disabled={valueSearch.trim()==''?true:false}
                onPress={() =>{
                    if(valueSearch.trim()!=='')
                        {
                            handleOnSearch(valueSearch)
                        }
                }}>
                    <Icon style={{ padding: 5 }} name="search-outline" size={25} color="#000" />
                </TouchableOpacity>
                <TextInput
                    onChangeText={(text) =>{
                        setValueSearch(text);
                        if(text.trim().length === 0)
                            handleOnHideData()
                    }}
                    onSubmitEditing={() =>{
                        if(valueSearch.trim()!=='')
                        {
                            handleOnSearch(valueSearch)
                        }
                    }}
                    value={valueSearch}
                    style={{ flex: 1, paddingVertical: 4, fontFamily: 'Nunito-Bold', }} placeholder={type!=='group'?"Nhập Tên hoặc Email":'Nhập tên nhóm'}></TextInput>
                {
                    valueSearch !== '' ? (
                        <TouchableOpacity
                            onPress={() => {
                                setValueSearch('')
                                 handleOnHideData()
                            }}
                        >
                            <Icon style={{ padding: 5 }} name="close-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    ) : null
                }
            </View>
            <Pressable
                onPress={()=>{
                    setValueSearch('')
                    handleOnHideData()
                    navigation.goBack()
                }}
            >
                <Text style={styles.txtCancel}>Cancel</Text>
            </Pressable>
        </View>
  );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        // marginBottom:10,
        backgroundColor:'#fff'

    },
    containerSearch: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        marginVertical: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    txtCancel: { textAlign: 'center', color: '#000',fontWeight: 'bold'}
});