import React,{useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {TransitionPresets} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Home from './../screens/Home';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import { Avatar, Badge, withBadge } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Comments from './../screens/Comments';
import UpDatePost from './../screens/UpDatePost/UpdatePost';
import UploadPost from './../screens/UploadPost';
import ProfileUser from './../screens/ProfileUser/ProfileUser';
import UpdateProfileUser from './../screens/UpdateProfileUser/UpdateProfileUser';
import Search from './../screens/Search/Search';
import Chat from './../screens/Chat/Chat';
import Messages from './../screens/Chat/Messages';
import Groups from './../screens/Groups/Groups';
import CreateGroup from './../screens/Groups/CreateGroup';
import DetailGroup from './../screens/Groups/DetailGroup';
import MyGroups from './../screens/Groups/MyGroups/MyGroups';
import DescGroup from './../screens/Groups/DetailGroup/DescGroup';
import MembersGroup from './../screens/Groups/DetailGroup/MembersGroup';
import Invites from './../screens/Groups/Invites/Invites';
import Membership from './../screens/Groups/Membership/Membership';
import InvitesFriends from './../screens/Groups/InvitesFriends/InvitesFriends';
import Notification from './../screens/Notification/Notification';
import SettingsGroup from './../screens/Groups/DetailGroup/SettingsGroup/SettingsGroup';
import UpdateDescGroup from './../screens/Groups/DetailGroup/SettingsGroup/UpdateDescGroup';
import DrawerContent from "./../screens/DrawerContent/DrawerContent";
import UsersManagement from "./../screens/Admin/UsersManagement/UsersManagement";
import Reports from "./../screens/Admin/Reports/Reports";
import PostDetail from "./../screens/Post/PostDetail";
import ListUserFollow from "./../screens/ProfileUser/ListUserFollow/ListUserFollow";
import ListUserFollower from "./../screens/ProfileUser/ListUserFollow/ListUserFollower";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MyTabs=()=> {
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [totalMessageUnread, setTotalMessageUnread] = useState(0);
    useEffect(() => {
        const unsubscribe = firestore().collection('users').doc(auth().currentUser.uid)
        .collection('notifications')
        .where('watched', '==', false)
        .onSnapshot(querySnapshot => {
                setTotalNotifications(querySnapshot.size);
            });
        const unsubscribe2 = firestore().collection('users').doc(auth().currentUser.uid)
        .collection('messages_threads')
        .where('watched', '==', false)
        .onSnapshot(querySnapshot => {
                setTotalMessageUnread(querySnapshot.size);
            });
        return () => {
            unsubscribe()
            unsubscribe2()
        }
    }, [])
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#09bff2"
      inactiveColor="gray"
      barStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Trang Chủ',
          tabBarIcon: ({color}) => (
            <Icon name="planet" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={Groups}
        options={{
          tabBarLabel: 'Hội nhóm',
          tabBarIcon: ({color}) => (
            <Icon2 name="users" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({color,focused}) => (
              <>
            <Icon name="notifications" size={24} color={color} />
            {(!focused&&!!totalNotifications)&&<Badge
                    status="error"
                    containerStyle={{ position: 'absolute', top: -6, right: -10}}
                    value={totalNotifications}
                />}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({color,focused}) => (
              <>
            <Icon name="chatbox" size={24} color={color} />
            {(!focused&&!!totalMessageUnread)&&<Badge
                    status="error"
                    containerStyle={{ position: 'absolute', top: -6, right: -10}}
                    value={totalMessageUnread}
                />}
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const StackGroups = () => {
  return (
    <Stack.Navigator
        // initialRouteName="MyGroups"
        screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="MyGroups"
        component={MyGroups}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Invites"
        component={Invites}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Membership"
        component={Membership}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="DetailGroup"
        component={DetailGroup}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="DescGroup"
        component={DescGroup}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="MembersGroup"
        component={MembersGroup}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="InvitesFriends"
        component={InvitesFriends}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsGroup"
        component={SettingsGroup}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="UpdateDescGroup"
        component={UpdateDescGroup}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};
const MenuDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MyTabs" 
      drawerContent={props =><DrawerContent/>}
      screenOptions={{
        headerShown: false,
      }}
      >
      <Drawer.Screen name="MyTabs" component={MyTabs} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen name="UsersManagement" component={UsersManagement} />
    </Drawer.Navigator>
  );
}
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MenuDrawer"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="MenuDrawer"
        component={MenuDrawer}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen name="UploadPost" component={UploadPost} />
      <Stack.Screen
        name="UpDatePost"
        component={UpDatePost}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="ProfileUser"
        component={ProfileUser}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="UpdateProfileUser"
        component={UpdateProfileUser}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="StackGroups"
        component={StackGroups}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="ListUserFollow"
        component={ListUserFollow}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="ListUserFollower"
        component={ListUserFollower}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};




export default AppStack;
