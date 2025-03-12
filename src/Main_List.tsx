/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useState, useEffect} from 'react';
import React from 'react';
import {RefreshControl} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './API';

function Main_List(): JSX.Element {
  console.log('--Main_List()');

  const [callList, setCallList] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestCallList = async () => {
    let userId = (await AsyncStorage.getItem('userId')) || '';
    setLoading(true);
    api.list(userId).then(response => {
      let {code, message, data} = response.data;
      if (code === 0) {
        setCallList(data);
      } else {
        Alert.alert('오류', message, [
          {
            text: '확인',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    requestCallList();
  }, []);

  const Header = () => (
    <View style={styles.header}>
      <Text style={[styles.headerText, {width: wp(80)}]}>출발지 / 도착지</Text>
      <Text style={[styles.headerText, {width: wp(20)}]}>상태</Text>
    </View>
  );

  const ListItem = ({
    item,
  }: {
    item: {start_addr: string; end_addr: string; call_state: string};
  }) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 5, width: wp(100)}}>
        <View style={{width: wp(80)}}>
          <Text style={styles.textForm}>{item.start_addr}</Text>
          <Text style={[styles.textForm, {borderTopWidth: 0}]}>
            {item.end_addr}
          </Text>
        </View>
        <View
          style={{
            width: wp(20),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{item.call_state}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{flex: 1, width: '100%'}}
        data={callList}
        ListHeaderComponent={Header}
        renderItem={ListItem}
        keyExtractor={item => item.id} // keyExtractor에서 id 사용
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={requestCallList} />
        }
      />
      <Modal transparent={true} visible={loading}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="spinner" size={50} color="#3498db" />
          <Text style={{color: 'black'}}>Loading...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 5,
    backgroundColor: '#3498db',
    color: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  textForm: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3498db',
    height: hp(5),
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default Main_List;
