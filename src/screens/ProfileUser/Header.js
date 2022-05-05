import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Modal,
    ToastAndroid
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
const Header = ({ title, uidUser }) => {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const handleClickButtonReportUser = () => {
        firestore()
            .collection('users')
            .doc(uidUser)
            .update({
                report: firestore.FieldValue.arrayUnion(auth().currentUser.uid)
            })
            .then(() => {
                ToastAndroid.show('Đã báo cáo thành công', ToastAndroid.SHORT)
                setModalVisible(false)
            })
    }

    const handleClickBlockUser = () => {
        firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .update({
                block: firestore.FieldValue.arrayUnion(uidUser)
            })
            .then(() => {
                ToastAndroid.show('Đã chặn thành công', ToastAndroid.SHORT)
                setModalVisible(false)
                navigation.navigate('Home')
            })
            .catch(() => {
                ToastAndroid.show('Đã xảy ra lỗi', ToastAndroid.SHORT)
            })
        firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .update({
                follower: firestore.FieldValue.arrayRemove(uidUser),
                follow: firestore.FieldValue.arrayRemove(uidUser)
            })
        firestore()
            .collection('users')
            .doc(uidUser)
            .update({
                follower: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                follow: firestore.FieldValue.arrayRemove(auth().currentUser.uid)
            })
    }
    return (
        <>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name='chevron-back-outline' size={30} color={'black'} />
                </Pressable>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        flex: 1,
                        paddingHorizontal: 10
                    }}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                {uidUser !== auth().currentUser.uid && (
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true)
                        }}
                    >
                        <Icon name='ellipsis-horizontal-circle-outline' size={30} color={'black'} />
                    </TouchableOpacity>
                )}
            </View>
            <Modal transparent={true} visible={modalVisible}>
                <Pressable
                    onPress={() => setModalVisible(false)}
                    style={{ flex: 1, backgroundColor: 'black', opacity: 0.2 }}
                ></Pressable>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            handleClickButtonReportUser()
                        }}
                    >
                        <Icon name='information-circle-outline' size={24} color='black' />
                        <Text style={{ fontSize: 16, marginLeft: 10 }}>Báo cáo người dùng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            handleClickBlockUser()
                        }}
                    >
                        <Icon name='information-circle-outline' size={24} color='black' />
                        <Text style={{ fontSize: 16, marginLeft: 10 }}>Chặn người dùng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}

export default Header
const styles = StyleSheet.create({
    header: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.3,
        borderBottomColor: '#d1d1d1',
        backgroundColor: 'white'
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        elevation: 5,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 10,
        paddingVertical: 20
    },
    modalItem: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    }
})
