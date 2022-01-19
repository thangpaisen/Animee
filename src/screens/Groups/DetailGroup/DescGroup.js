import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Colors from './../../../assets/themes/Colors';
import ItemMember from "./ItemMember";
import dateFormat from "dateformat";
const DescGroup = ({route}) => {
  const {dataGroup} = route.params;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.nameGroup} numberOfLines={1}>
          {dataGroup?.name}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.description}>
            <Text style={styles.hdDescription}>Giới thiệu</Text>
        <Text style={styles.textDescription}>{dataGroup?.description}</Text>
        </View>
        <View style={styles.member}>
            <View style={styles.hdMember}>
                <Text style={styles.hdMemberText}>Thành viên</Text>
                <TouchableOpacity style={styles.btnMoreMember}
                    onPress={() =>navigation.navigate('MembersGroup',{dataGroup:dataGroup})}
                >
                    <Text style={styles.btnMoreMemberText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listMember}>
                {dataGroup?.members?.map((item, index) => {
                return (
                    <ItemMember key={index} data={item} index={index} />
                )
            })}
            </View>
        </View>
        <View style={styles.groupActivity}>
            <Text style={styles.hdMemberText}>Hoạt động</Text>
            <View style={styles.itemActivity}>
                <Icon name="md-people" size={20} color={'#333'} />
                <Text style={styles.textItemActivity}>Tổng sổ {dataGroup?.members.length} thành viên</Text>
            </View>
            <View style={styles.itemActivity}>
                <Icon name="md-create" size={20} color={'#333'} />
                <Text style={styles.textItemActivity}>Đã tạo {dateFormat(dataGroup?.createdAt, 'dd-mm-yyyy ')}</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export default DescGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#d1d1d1',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  nameGroup: {
    flex: 1,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 10,
  },
  content: {
    padding: 10,
  },
  description: {
      paddingVertical: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: '#d1d1d1',
  },
  hdDescription: {
    paddingVertical: 10,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 16,
    color: '#333',
  },
    member: {
        paddingVertical: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: '#d1d1d1',
    },
    hdMember: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hdMemberText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    btnMoreMember: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: '#d1d1d1',
    },
    btnMoreMemberText: {
        fontSize: 16,
        color: '#333',
    },
listMember:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,

},
groupActivity:{
        paddingVertical: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: '#d1d1d1',
},
itemActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
},
textItemActivity: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
},
});
