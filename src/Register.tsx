/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import api from './API'; // API 호출 파일

function Register(): JSX.Element {
  console.log('--Register()');

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userPw2, setUserPw2] = useState('');

  // 버튼 비활성화 여부 확인
  const isDisable = () => {
    return !(userId && userPw && userPw2 && userPw === userPw2);
  };

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const onRegister = () => {
    console.log('회원가입 요청 시작'); // 로그 추가
    api
      .register(userId, userPw)
      .then(response => {
        console.log('회원가입 응답:', response.data); // 응답 로그 추가
        const {code, message} = response.data;

        let title = '알림';
        if (code === 0) {
          console.log('회원가입 성공');
          navigation.pop(); // 성공 시 이전 화면으로 이동
        } else {
          title = '오류';
        }

        Alert.alert(title, message, [
          {
            text: '확인',
            onPress: () => console.log('확인 눌림'),
            style: 'cancel',
          },
        ]);
      })
      .catch(err => {
        console.log('오류 발생: ' + JSON.stringify(err)); // 오류 처리 로그
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, {justifyContent: 'flex-end'}]}>
        <Icon name="taxi" size={80} color={'#3498db'} />
      </View>
      <View style={[styles.container, {flex: 2}]}>
        <TextInput
          style={styles.input}
          placeholder={'아이디'}
          onChangeText={newId => setUserId(newId)}
        />
        <TextInput
          style={styles.input}
          placeholder={'비밀번호'}
          secureTextEntry={true}
          onChangeText={newPw => setUserPw(newPw)}
        />
        <TextInput
          style={styles.input}
          placeholder={'비밀번호 확인'}
          secureTextEntry={true}
          onChangeText={newPw2 => setUserPw2(newPw2)}
        />
      </View>
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <TouchableOpacity
          disabled={isDisable()} // 비활성화 여부 확인
          onPress={() => {
            console.log('회원가입 버튼 클릭');
            onRegister(); // 회원가입 요청
          }}
          style={isDisable() ? styles.buttonDisable : styles.button}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    width: '70%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
  },
  buttonDisable: {
    width: '70%',
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Register;
