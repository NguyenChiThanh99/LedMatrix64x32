import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import Toast from 'react-native-root-toast';

import backIcon from '../icons/back.png';

export default function clock({navigation, route}) {
  const [color, setColor] = useState([
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  ]);
  const [inputColor, setInputColor] = useState('#ffffff');
  const [statusModal, setStatusModal] = useState({location: 0, status: false});
  const [loading, setLoading] = useState(false);

  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const hexToRgb = hex => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const saveColor = () => {
    var arrColor = [...color];
    arrColor[statusModal.location * 3] = hexToRgb(inputColor).r;
    arrColor[statusModal.location * 3 + 1] = hexToRgb(inputColor).g;
    arrColor[statusModal.location * 3 + 2] = hexToRgb(inputColor).b;
    setColor(arrColor);
    setInputColor('#ffffff');
    setStatusModal({location: 0, status: false});
  };

  const sendColor = () => {
    setLoading(true);
    fetch('http://' + route.params.ip + '/color', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        arr: color,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.res === 'Success') {
          setLoading(false);
          Toast.show('Gửi màu thành công', {
            position: 0,
            duration: 1500,
          });
        } else {
          setLoading(false);
          Toast.show('Gửi màu không thành công, vui lòng thử lại', {
            position: 0,
            duration: 2500,
          });
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        Toast.show('Gửi màu không thành công, vui lòng thử lại', {
          position: 0,
          duration: 2500,
        });
      });
  };

  const Loading = (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating={loading} color="white" size="small" />
    </View>
  );

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconCont}
          onPress={() => navigation.goBack()}>
          <Image style={styles.headerIcon} source={backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chức năng Thay đổi màu Đồng hồ</Text>
      </View>

      <Text style={styles.inputTitle}>Ngày Dương lịch</Text>
      <View style={styles.inputCont}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={{marginTop: 14, width: width / 7}}>Ngày:</Text>
            <Text style={{marginTop: 14, width: width / 7}}>Tháng:</Text>
            <Text style={{marginTop: 14, width: width / 7}}>Năm:</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 0, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[0], color[1], color[2])},
              ]}>
              <Text>{rgbToHex(color[0], color[1], color[2])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 1, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[3], color[4], color[5])},
              ]}>
              <Text>{rgbToHex(color[3], color[4], color[5])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 2, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[6], color[7], color[8])},
              ]}>
              <Text>{rgbToHex(color[6], color[7], color[8])}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginLeft: 50}}>
          <View>
            <Text style={{marginTop: 14, width: width / 7}}>Thứ:</Text>
            <Text style={{marginTop: 14, width: width / 4}}>Dấu chấm:</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 3, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[9], color[10], color[11])},
              ]}>
              <Text>{rgbToHex(color[9], color[10], color[11])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 4, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[12], color[13], color[14])},
              ]}>
              <Text>{rgbToHex(color[12], color[13], color[14])}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={[styles.inputTitle, {width: width / 6}]}>Đồng hồ</Text>
      <View style={styles.inputCont}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={{marginTop: 14, width: width / 7}}>Giờ:</Text>
            <Text style={{marginTop: 14, width: width / 7}}>Phút:</Text>
            <Text style={{marginTop: 14, width: width / 7}}>Giây:</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 5, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[15], color[16], color[17])},
              ]}>
              <Text>{rgbToHex(color[15], color[16], color[17])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 6, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[18], color[19], color[20])},
              ]}>
              <Text>{rgbToHex(color[18], color[19], color[20])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 7, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[21], color[22], color[23])},
              ]}>
              <Text>{rgbToHex(color[21], color[22], color[23])}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginLeft: 50}}>
          <View>
            <Text style={{marginTop: 14, width: width / 4}}>Dấu hai chấm:</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 8, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[24], color[25], color[26])},
              ]}>
              <Text>{rgbToHex(color[24], color[25], color[26])}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={[styles.inputTitle, {width: width / 4}]}>Ngày Âm lịch</Text>
      <View style={styles.inputCont}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={{marginTop: 14, width: width / 7}}>Ngày:</Text>
            <Text style={{marginTop: 14, width: width / 7}}>Tháng:</Text>
            <Text style={{marginTop: 14, width: width / 7}}>Năm:</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 9, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[27], color[28], color[29])},
              ]}>
              <Text>{rgbToHex(color[27], color[28], color[29])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 10, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[30], color[31], color[32])},
              ]}>
              <Text>{rgbToHex(color[30], color[31], color[32])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 11, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[33], color[34], color[35])},
              ]}>
              <Text>{rgbToHex(color[33], color[34], color[35])}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginLeft: 50}}>
          <View>
            <Text style={{marginTop: 14, width: width / 6}}>Chữ "AL":</Text>
            <Text style={{marginTop: 14, width: width / 4}}>Dấu chấm:</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 12, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[36], color[37], color[38])},
              ]}>
              <Text>{rgbToHex(color[36], color[37], color[38])}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusModal({location: 13, status: true})}
              style={[
                styles.itemColor,
                {backgroundColor: rgbToHex(color[39], color[40], color[41])},
              ]}>
              <Text>{rgbToHex(color[39], color[40], color[41])}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={[styles.inputTitle, {width: width / 2.8}]}>
        Màu sắc sẽ hiển thị
      </Text>
      <View style={styles.inputCont}>
        <View style={styles.reviewCont}>
          <View style={styles.reviewLine}>
            <Text
              style={[
                styles.reviewLineText,
                {
                  color: rgbToHex(color[9], color[10], color[11]),
                  marginRight: 10,
                },
              ]}>
              T3
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[0], color[1], color[2])},
              ]}>
              08
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[12], color[13], color[14])},
              ]}>
              .
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[3], color[4], color[5])},
              ]}>
              03
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[12], color[13], color[14])},
              ]}>
              .
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[6], color[7], color[8])},
              ]}>
              22
            </Text>
          </View>

          <View style={styles.reviewLine}>
            <Text
              style={[
                styles.reviewLineText2,
                {
                  color: rgbToHex(color[15], color[16], color[17]),
                },
              ]}>
              20
            </Text>
            <Text
              style={[
                styles.reviewLineText2,
                {color: rgbToHex(color[24], color[25], color[26])},
              ]}>
              :
            </Text>
            <Text
              style={[
                styles.reviewLineText2,
                {color: rgbToHex(color[18], color[19], color[20])},
              ]}>
              30
            </Text>
            <Text
              style={[
                styles.reviewLineText2,
                {color: rgbToHex(color[24], color[25], color[26])},
              ]}>
              :
            </Text>
            <Text
              style={[
                styles.reviewLineText2,
                {color: rgbToHex(color[21], color[22], color[23])},
              ]}>
              45
            </Text>
          </View>

          <View style={styles.reviewLine}>
            <Text
              style={[
                styles.reviewLineText,
                {
                  color: rgbToHex(color[27], color[28], color[29]),
                },
              ]}>
              06
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[39], color[40], color[41])},
              ]}>
              .
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[30], color[31], color[32])},
              ]}>
              02
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[39], color[40], color[41])},
              ]}>
              .
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {color: rgbToHex(color[33], color[34], color[35])},
              ]}>
              22
            </Text>
            <Text
              style={[
                styles.reviewLineText,
                {
                  color: rgbToHex(color[36], color[37], color[38]),
                  marginLeft: 10,
                },
              ]}>
              AL
            </Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModal.status}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.inputTitleModal}>Mã màu</Text>
            <View style={styles.inputContModal}>
              <TextInput
                spellCheck={false}
                autoCorrect={false}
                style={styles.inputModal}
                onChangeText={text => setInputColor(text)}
                value={inputColor}
                underlineColorAndroid={false}
              />
            </View>

            <ColorPicker
              color={'#fff'}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              swatches
              autoResetSlider
              onColorChangeComplete={color => {
                setInputColor(color);
              }}
            />

            <View style={styles.buttonCont}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#adadad'}]}
                onPress={() => {
                  setStatusModal({location: 0, status: false});
                }}>
                <Text style={styles.buttonText}>Thoát</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {marginLeft: 20}]}
                onPress={() => {
                  saveColor();
                }}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[
          styles.button,
          {marginLeft: 10, width: width / 5, marginTop: 10},
        ]}
        onPress={() => {
          sendColor();
        }}>
        {loading ? Loading : <Text style={styles.buttonText}>Gửi</Text>}
      </TouchableOpacity>
    </View>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  reviewCont: {
    backgroundColor: 'black',
    width: width - 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewLine: {
    flexDirection: 'row',
  },
  reviewLineText: {
    fontSize: 16,
  },
  reviewLineText2: {
    fontSize: 30,
  },
  inputModal: {
    padding: 0,
    marginTop: 8,
    marginLeft: 15,
  },
  inputContModal: {
    borderColor: '#8a8a8a',
    borderRadius: 5,
    borderWidth: 1,
    width: width - 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTitleModal: {
    color: '#ba562f',
    fontSize: 14,
    marginBottom: -9,
    backgroundColor: 'white',
    marginLeft: 15,
    zIndex: 1,
    width: width / 6,
    textAlign: 'center',
  },
  buttonCont: {
    flexDirection: 'row',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: '#ba562f',
    borderColor: '#8a8a8a',
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
  },
  centeredView: {
    height: height / 1.6,
    marginTop: height / 7,
    alignItems: 'center',
  },
  modalView: {
    padding: 10,
    height: height / 1.6,
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 20,
  },
  itemColor: {
    borderColor: '#8a8a8a',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'white',
    width: width / 6,
    height: 25,
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCont: {
    borderColor: '#8a8a8a',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 10,
    width: width - 20,
    padding: 10,
    flexDirection: 'row',
  },
  inputTitle: {
    color: '#ba562f',
    marginTop: 15,
    marginLeft: 20,
    fontSize: 14,
    marginBottom: -9,
    backgroundColor: '#f2f2f2',
    zIndex: 1,
    width: width / 3.5,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width,
    height: height / 17,
    backgroundColor: '#ba562f',
    paddingTop: 4,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  headerIcon: {
    width: width / 21,
    height: width / 21,
  },
  headerIconCont: {
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    marginLeft: 10,
    padding: 3,
  },
});
