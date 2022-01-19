import React,{useState,useEffect} from 'react';
import {StyleSheet, Text, View, Pressable, TextInput,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {useDispatch} from 'react-redux'
const Search = ({handleOnSearch,handleOnHideData}) => {
    const navigation = useNavigation();
    const [value, onChangeText] = useState('');
  return (
    <View style={styles.container}>
            <View style={styles.containerSearch}>
                <TouchableOpacity
                 disabled={value.trim()==''?true:false}
                    onPress={() =>{
                    if(value.trim()) handleOnSearch(value)
                }}>
                    <Icon style={{ padding: 5 }} name="search-outline" size={25} color="#000" />
                </TouchableOpacity>
                <TextInput
                    onChangeText={(text) =>{
                        onChangeText(text);
                        if(text.trim()) handleOnHideData()  
                    }}
                    onSubmitEditing={() =>{
                        if(value.trim()) handleOnSearch(value)
                    }}
                    value={value}
                    style={{ flex: 1, paddingVertical: 4, fontFamily: 'Nunito-Bold', }} placeholder={'Nhập Tên'}></TextInput>
                {
                    value !== '' ? (
                        <TouchableOpacity
                            onPress={() => {
                                onChangeText('')
                                 handleOnHideData()
                            }}
                        >
                            <Icon style={{ padding: 5 }} name="close-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    ) : null
                }
            </View>
        </View>
  );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        margin:10,
        marginBottom:0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    containerSearch: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        paddingVertical: 2,
        borderRadius:10,
    },
});