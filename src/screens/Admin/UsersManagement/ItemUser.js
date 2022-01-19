import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import dateFormat from 'dateformat';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
const ItemUser = ({item}) => {
  const navigation = useNavigation();
  const [totalPost, setTotalPost] = useState(0);
  const [isShowDetails, setIsShowDetails] = useState(false);
  useEffect(() => {
    firestore()
      .collection('postsUser')
      .where('uidUser', '==', item.id)
      .get()
      .then(snapshot => {
        setTotalPost(snapshot.size);
      });
  }, []);
  const handleOnClickBtnBlock = () => {
    if (item?.role?.toUpperCase() === 'ADMIN') {
      Alert.alert('Thông báo', 'Không thể khóa tài khoản Admin');
    } else {
      Alert.alert(
        'Thông báo',
        !item?.isBlocked
          ? 'Bạn có chắc chắn muốn Khoá Người dùng này'
          : 'Bạn muốn mở khoá Người dùng này',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'OK', onPress: () => handleOnBlockUser()},
        ],
      );
    }
  };
  const handleOnBlockUser = () => {
    firestore()
      .collection('users')
      .doc(item.id)
      .update({
        isBlocked: !item.isBlocked,
      })
      .then(() => {
        ToastAndroid.show('Thành công', ToastAndroid.SHORT);
      });
  };
  return (
    <View style={styles.itemUser}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: item?.imageAvatar}} style={styles.imageAvatar} />
        <View style={styles.infoUser}>
          <Text style={styles.nameUser} numberOfLines={1}>
            {item?.displayName}
          </Text>
          <Text style={styles.emailUser} numberOfLines={1}>
            {item?.email}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.btnChoice,
            item?.isBlocked == true && styles.btnChoiceBlock,
          ]}
          onPress={() => {
            handleOnClickBtnBlock();
          }}>
          <Text style={styles.textChoice}>
            {item?.isBlocked == false ? 'Khoá TK' : 'Mở khoá'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonMore}
          onPress={() => {
            setIsShowDetails(!isShowDetails);
          }}>
          <Icon
            name={
              !isShowDetails
                ? 'caret-down-circle-outline'
                : 'caret-up-circle-outline'
            }
            size={30}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      {isShowDetails && (
        <View style={styles.detailsInfo}>
          <Text style={styles.textDetails}>
            Trạng thái tài khoản:{' '}
            {item?.isBlocked == false ? 'Hoạt động' : 'Đã Bị Khoá'}
          </Text>
          <Text style={styles.textDetails}>
            Quyền: {item?.role || 'Người dùng'}
          </Text>
          <Text style={styles.textDetails}>
            Ngày đăng ký: {dateFormat(item?.createdAt, 'dd-mm-yyyy ')}
          </Text>
          <Text style={styles.textDetails}>
            Đăng nhập gần nhất: {dateFormat(item?.createdAt, 'dd-mm-yyyy ')}
          </Text>
          <Text style={styles.textDetails}>
            <Text style={{fontWeight: 'bold'}}>{item?.follow.length} </Text>
            Follow
            <Text style={{fontWeight: 'bold'}}> {item?.follower.length} </Text>
            Follower
          </Text>
          <Text style={styles.textDetails}>Tổng số bài viết: {totalPost}</Text>
          <TouchableOpacity
            style={styles.btnViewProfile}
            onPress={() => {
              navigation.navigate('ProfileUser', {uidUser: item.id});
            }}>
            <Text style={styles.textViewProfile}>Xem trang cá nhân</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ItemUser;

const styles = StyleSheet.create({
  itemUser: {
    marginTop: 20,
  },
  imageAvatar: {
    width: 44,
    height: 44,
    borderRadius: 25,
  },
  infoUser: {
    flex: 1,
    marginHorizontal: 10,
  },
  nameUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailUser: {
    fontSize: 14,
    color: '#666',
  },
  btnChoice: {
    marginRight: 20,
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: '#00A6FF',
    borderRadius: 10,
  },
  btnChoiceBlock: {
    backgroundColor: '#808080',
  },
  textChoice: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsInfo: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
  },
  textDetails: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  btnViewProfile: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
    padding: 6,
    paddingHorizontal: 20,
    backgroundColor: '#D8D6D6',
    borderRadius: 10,
  },
  textViewProfile: {
    fontSize: 16,
    color: '#000',
  },
});
