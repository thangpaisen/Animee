import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from './Header'
import ReportPost from "./ReportPost/ReportPost";
import MyTab from "./MyTab";
const Reports = () => {
    return (
        <View style={styles.container}>
            <Header title={'Quản lý Báo cáo'}/>
            <MyTab/>
        </View>
    )
}

export default Reports

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})
