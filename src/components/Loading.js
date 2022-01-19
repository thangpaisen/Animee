import React from 'react'
import { StyleSheet, Text, View,Image } from 'react-native'
import imageLoading from '../assets/images/loading1.gif'
const Loading = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.imageLoading} source={imageLoading}/>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageLoading:{
        width:40,
        // height:50,
        resizeMode: 'contain'
    }

})