import React,{ useEffect, useState } from 'react'
import { StyleSheet, Text, View,Image,StatusBar } from 'react-native'

import * as Animatable from 'react-native-animatable';
import Logo from '../assets/images/animee.gif'
const SplashScreen = () => {

    return (
        <View style={styles.container}>
            <Image
            style={styles.logo}
                source={Logo}
                />
        </View>
    )
}
export default SplashScreen;
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },
    logo:{
        width:200,
        height:200,
        resizeMode: 'contain'
    },
})