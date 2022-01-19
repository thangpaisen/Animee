import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReportPost from "./ReportPost/ReportPost";
import ReportGroups from "./ReportGroups/ReportGroups";
import ReportUsers from "./ReportUsers/ReportUsers";
const Tab = createMaterialTopTabNavigator();
const MyTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle:{width:0},
                tabBarPressColor: '#fff',
                swipeEnabled: true,
            }}
        >
            <Tab.Screen name="ReportPost" component={ReportPost} 
                options={{ 
                    title: ({color,focused}) => (
                        <View style={[styles.itemTab,focused&&styles.itemTabActive]}>
                            <Text style={[styles.textTab]}>Bài viết</Text>
                        </View>
                    ),
                }}/>
            <Tab.Screen name="ReportUsers" component={ReportUsers}
                options={{ 
                        title: ({color,focused}) => (
                            <View style={[styles.itemTab,focused&&styles.itemTabActive]}>
                                <Text style={[styles.textTab]}>Người dùng</Text>
                            </View>
                        ),
                    }}/>
            <Tab.Screen name="ReportGroups" component={ReportGroups}  
                options={{ 
                        title: ({color,focused}) => (
                            <View style={[styles.itemTab,focused&&styles.itemTabActive]}>
                                <Text style={[styles.textTab]}>Nhóm</Text>
                            </View>
                        ),
                    }}/>
        </Tab.Navigator>
    )
}

export default MyTab

const styles = StyleSheet.create({
    itemTab:{
        backgroundColor: '#C4C4C4',
        padding: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    itemTabActive:{
        backgroundColor: '#00A6FF',
    },
    textTab:{
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',

    }
})
