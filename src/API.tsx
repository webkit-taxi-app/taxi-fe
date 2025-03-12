import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.0.3:3000', // 서버 주소
  timeout: 10000, // 요청 시간 초과 설정
});

export default {
  test() {
    return instance.get('/taxi/test');
  },

  login(id: string, pw: string) {
    return instance.post('/taxi/login', {userId: id, userPw: pw});
  },

  register(id: string, pw: string) {
    console.log('회원가입 API 호출:', id, pw); // 로그 추가
    return instance.post('/taxi/register', {userId: id, userPw: pw});
  },

  list(id: string) {
    return instance.post('/taxi/list', {userId: id});
  },

  geoCoding(coords: any, key: string) {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json';
    let lat = coords.latitude;
    let lng = coords.longitude;

    return axios.get(`${url}?latlng=${lat},${lng}&key=${key}&language=ko`);
  },

  call(
    id: string,
    startLat: string,
    startLng: string,
    startAddr: string,
    endLat: string,
    endLng: string,
    endAddr: string,
  ) {
    return instance.post('/taxi/call', {
      userId: id,
      startLat: startLat,
      startLng,
      startAddr: startAddr,
      endLat: endLat,
      endLng: endLng,
      endAddr: endAddr,
    });
  },
};
