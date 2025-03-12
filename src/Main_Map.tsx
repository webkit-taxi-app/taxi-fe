/* eslint-disable quotes */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import api from './API';
import Geolocation from '@react-native-community/geolocation';

function Main_Map(): JSX.Element {
  console.log('--Main_Map()');

  const [showBtn, setShowBtn] = useState(false);
  const [markers, setMarkers] = useState([]); // Markers state
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.5666612,
    longitude: 126.9783785,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedAddress, setSelectedAddress] = useState('');

  // Add marker when long press
  const handleLongPress = (event: any) => {
    const {coordinate} = event.nativeEvent;
    setSelectedLatLng(coordinate);

    setLoading(true);
    api
      .geoCoding(coordinate, query.key)
      .then(response => {
        setSelectedAddress(response.data.results[0].formatted_address);
        setShowBtn(true);
        setLoading(false);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        setLoading(false);
      });
  };

  const autocomplete1: any = useRef(null);
  const autocomplete2: any = useRef(null);

  const handleAddMarker = (title: string) => {
    if (selectedAddress) {
      if (title === '출발지') {
        setMarker1(selectedLatLng);
        if (autocomplete1.current) {
          autocomplete1.current.setAddressText(selectedAddress);
        }
      } else {
        setMarker2(selectedLatLng);
        if (autocomplete2.current) {
          autocomplete2.current.setAddressText(selectedAddress);
        }
      }
      setShowBtn(false);
    }
  };

  const handleMyLocationPress = () => {
    // Location permission and fetching logic
  };

  const [marker1, setMarker1] = useState({latitude: 0, longitude: 0});
  const [marker2, setMarker2] = useState({latitude: 0, longitude: 0});

  const onSeleCtAddr = (data: any, details: any, type: string) => {
    if (details) {
      let lat = details.geometry.location.lat;
      let lng = details.geometry.location.lng;

      if (type === 'start') {
        setMarker1({latitude: lat, longitude: lng});
        if (marker2.longitude === 0) {
          setInitialRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0073,
            longitudeDelta: 0.0064,
          });
        }
      } else {
        setMarker2({latitude: lat, longitude: lng});
        if (marker1.longitude === 0) {
          setInitialRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0073,
            longitudeDelta: 0.0064,
          });
        }
      }
    }
  };

  const mapRef: any = useRef(null);

  // Center map on two markers
  if (marker1.latitude !== 0 && marker2.longitude !== 0) {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([marker1, marker2], {
        edgePadding: {top: 120, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }

  const setMyLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        let coords = {latitude, longitude};
        setMarker1(coords);
        setInitialRegion({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
        setInitialRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0073,
          longitudeDelta: 0.0064,
        });
        api
          .geoCoding(coords, query.key)
          .then(response => {
            let addr = response.data.results[0].formatted_address;
            autocomplete1.current.setAddressText(addr);
            setLoading(false);
          })
          .catch(err => {
            console.log(JSON.stringify(err));
            setLoading(false);
          });
      },
      error => {
        setLoading(false);
        console.log('!!! 오류 발생 / error = ' + JSON.stringify(error));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000,
      },
    );
  };

  const query = {
    key: 'AIzaSyByt-RfF3raQtPWG_9EMWrdvgtxQvBTl9Q', // Replace with your API key
    language: 'ko',
    components: 'country:kr',
  };

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  // Call taxi
  const callTaxi = async () => {
    let userId = (await AsyncStorage.getItem('userId')) || '';
    let startAddr = autocomplete1.current.getAddressText();
    let endAddr = autocomplete2.current.getAddressText();
    let startLat = `${marker1.latitude}`;
    let startLng = `${marker1.longitude}`;
    let endLat = `${marker2.latitude}`;
    let endlng = `${marker2.longitude}`;

    if (!(startAddr && endAddr)) {
      Alert.alert('알림', '출발지/도착지가 모두 입력되어야 합니다.', [
        {text: '확인', style: 'cancel'},
      ]);
      return;
    }

    api
      .call(userId, startLat, startLng, startAddr, endLat, endlng, endAddr)
      .then(response => {
        let {code, message} = response.data;
        let title = '알림';
        if (code === 0) {
          navigation.navigate('Main_List');
        } else {
          title = '오류';
        }

        Alert.alert(title, message, [{text: '확인', style: 'cancel'}]);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <MapView
        onPress={() => {
          setShowBtn(false);
        }}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        region={initialRegion}
        ref={mapRef}
        onLongPress={handleLongPress}>
        <Marker coordinate={marker1} title="출발 위치" />
        <Marker coordinate={marker2} title="도착 위치" pinColor="blue" />
        {marker1.latitude !== 0 && marker2.longitude !== 0 && (
          <Polyline
            coordinates={[marker1, marker2]}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Overlay components */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        {/* Address input fields */}
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: 10,
            width: '100%',
            paddingHorizontal: wp(2),
          }}>
          <View style={{width: wp(75)}}>
            <GooglePlacesAutocomplete
              ref={autocomplete1}
              onPress={(data, details) => onSeleCtAddr(data, details, 'start')}
              minLength={2}
              placeholder="출발지 검색"
              query={query}
              keyboardShouldPersistTaps={'handled'}
              fetchDetails={true}
              enablePoweredByContainer={false}
              onFail={error => console.log(error)}
              onNotFound={() => console.log('no results')}
              styles={autocompleteStyles}
            />
            <GooglePlacesAutocomplete
              ref={autocomplete2}
              onPress={(data, details) => onSeleCtAddr(data, details, 'end')}
              minLength={2}
              placeholder="도착지 검색"
              query={query}
              keyboardShouldPersistTaps={'handled'}
              fetchDetails={true}
              enablePoweredByContainer={false}
              onFail={error => console.log(error)}
              onNotFound={() => console.log('no results')}
              styles={autocompleteStyles}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, {marginLeft: 10, justifyContent: 'center'}]}
            onPress={callTaxi}>
            <Text style={styles.buttonText}>호출</Text>
          </TouchableOpacity>
        </View>

        {/* My location button */}
        <TouchableOpacity
          style={{position: 'absolute', bottom: 20, right: 20}}
          onPress={setMyLocation}>
          <Icon name="crosshairs" size={40} color={'#3498db'} />
        </TouchableOpacity>

        {/* Mark registration pop-up */}
        {showBtn && (
          <View
            style={{
              position: 'absolute',
              top: hp(50) - 45,
              left: wp(50) - 75,
              height: 90,
              width: 150,
              backgroundColor: 'rgba(255,255,255,0.8)', // Non-transparent background
            }}>
            <TouchableOpacity
              style={[styles.button, {flex: 1, marginVertical: 1}]}
              onPress={() => handleAddMarker('출발지')}>
              <Text style={styles.buttonText}>출발지로 등록</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {flex: 1}]}
              onPress={() => handleAddMarker('도착지')}>
              <Text style={styles.buttonText}>도착지로 등록</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal transparent={true} visible={loading}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="spinner" size={50} color="blue" />
          <Text style={{backgroundColor: 'white', color: 'black', height: 20}}>
            Now Loading...
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const autocompleteStyles = {
  textInputContainer: {
    width: '100%',
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    height: 40,
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    color: '#5d5d5d',
    fontSize: 16,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
    zIndex: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
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
  buttonDisable: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: 'gray',
    marginVertical: 1,
    padding: 10,
  },
});

export default Main_Map;
