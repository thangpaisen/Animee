import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Nodata = ({title}) => {
    return (
        <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center',padding:20,fontSize: 16}}>{ title || 'Không có dữ liệu'}</Text>
          </View>
    )
}

export default Nodata

const styles = StyleSheet.create({})
