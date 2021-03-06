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
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import Toast from 'react-native-root-toast';

import backIcon from '../icons/back.png';
import swichLeft from '../icons/toggle.png';
import swichRight from '../icons/toggle2.png';

export default function clock({navigation, route}) {
  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(flicker => !flicker);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [color, setColor] = useState([
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0,
    0,
  ]);
  const [inputColor, setInputColor] = useState('ffffff');
  const [statusModal, setStatusModal] = useState({location: 0, status: false});
  const [loading, setLoading] = useState(false);
  const [flicker, setFlicker] = useState(true);
  const [hourOn, setHourOn] = useState(6);
  const [hourOff, setHourOff] = useState(1);
  const [minOn, setMinOn] = useState(0);
  const [minOff, setMinOff] = useState(0);

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
    if (hexToRgb('#' + inputColor) !== null) {
      var arrColor = [...color];
      arrColor[statusModal.location * 3] = hexToRgb('#' + inputColor).r;
      arrColor[statusModal.location * 3 + 1] = hexToRgb('#' + inputColor).g;
      arrColor[statusModal.location * 3 + 2] = hexToRgb('#' + inputColor).b;
      setColor(arrColor);
      setInputColor('ffffff');
      setStatusModal({location: 0, status: false});
    } else {
      Toast.show('Vui l??ng ki???m tra l???i m?? m??u ???? nh???p', {
        position: 20,
        duration: 2000,
      });
    }
  };

  const sendColor = () => {
    if (color[43] === 1 && !checkTime()) {
      return;
    }
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
          Toast.show('G???i m??u th??nh c??ng', {
            position: 0,
            duration: 1500,
          });
        } else {
          setLoading(false);
          Toast.show('G???i m??u kh??ng th??nh c??ng, vui l??ng th??? l???i', {
            position: 0,
            duration: 2500,
          });
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        Toast.show('G???i m??u kh??ng th??nh c??ng, vui l??ng th??? l???i', {
          position: 0,
          duration: 2500,
        });
      });
  };

  const colorColon = () => {
    if (color[42] === 0) {
      return rgbToHex(color[24], color[25], color[26]);
    } else {
      if (flicker) {
        return rgbToHex(color[24], color[25], color[26]);
      } else {
        return 'black';
      }
    }
  };

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

  const randomColor = () => {
    var arrColor = [...color];
    for (let i = 0; i < 14; i++) {
      var genColor = generateColor();
      arrColor[i * 3] = hexToRgb(genColor).r;
      arrColor[i * 3 + 1] = hexToRgb(genColor).g;
      arrColor[i * 3 + 2] = hexToRgb(genColor).b;
    }
    arrColor[42] = Math.random() < 0.5 ? 1 : 0;
    setColor(arrColor);
    setInputColor('ffffff');
    setStatusModal({location: 0, status: false});
  };

  const checkTime = () => {
    if (
      hourOn !== '' &&
      hourOn >= 0 &&
      hourOn <= 23 &&
      hourOff !== '' &&
      hourOff >= 0 &&
      hourOff <= 23 &&
      minOn !== '' &&
      minOn >= 0 &&
      minOn <= 59 &&
      minOff !== '' &&
      minOff >= 0 &&
      minOff <= 59
    ) {
      var arrColor = [...color];
      arrColor[44] = hourOn;
      arrColor[45] = minOn;
      arrColor[46] = hourOff;
      arrColor[47] = minOff;
      setColor(arrColor);
      return true;
    } else {
      Toast.show('Vui l??ng ki???m tra l???i th???i gian b???t/t???t', {
        position: 0,
        duration: 2000,
      });
      return false;
    }
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
        <Text style={styles.headerText}>Ch???c n??ng Thay ?????i m??u ?????ng h???</Text>
      </View>

      <ScrollView
        style={{
          height: height - height / 11,
        }}>
        <Text style={styles.inputTitle}>Ng??y D????ng l???ch</Text>
        <View style={styles.inputCont}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={{marginTop: 14, width: width / 6.5}}>Ng??y:</Text>
              <Text style={{marginTop: 14, width: width / 6.5}}>Th??ng:</Text>
              <Text style={{marginTop: 14, width: width / 6.5}}>N??m:</Text>
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

          <View style={{flexDirection: 'row', marginLeft: 40}}>
            <View>
              <Text style={{marginTop: 14, width: width / 4.5}}>D???u ch???m:</Text>
              <Text style={{marginTop: 14, width: width / 6.5}}>Th???:</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setStatusModal({location: 4, status: true})}
                style={[
                  styles.itemColor,
                  {backgroundColor: rgbToHex(color[12], color[13], color[14])},
                ]}>
                <Text>{rgbToHex(color[12], color[13], color[14])}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatusModal({location: 3, status: true})}
                style={[
                  styles.itemColor,
                  {backgroundColor: rgbToHex(color[9], color[10], color[11])},
                ]}>
                <Text>{rgbToHex(color[9], color[10], color[11])}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[styles.inputTitle, {width: width / 4.7}]}>?????ng h???</Text>
        <View style={styles.inputCont}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={{marginTop: 14, width: width / 6.5}}>Gi???:</Text>
              <Text style={{marginTop: 14, width: width / 6.5}}>Ph??t:</Text>
              <Text style={{marginTop: 14, width: width / 6.5}}>Gi??y:</Text>
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

          <View style={{flexDirection: 'row', marginLeft: 40}}>
            <View>
              <Text style={{marginTop: 14, width: width / 4.5}}>
                D???u hai ch???m:
              </Text>
              <Text style={{marginTop: 14, width: width / 4.5}}>
                Nh???p nh??y d???u hai ch???m:
              </Text>
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
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10,
                  marginTop: 18,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 10}}>Off</Text>
                <TouchableOpacity
                  onPress={() => {
                    var arrColor = [...color];
                    arrColor[42] = color[42] === 0 ? 1 : 0;
                    setColor(arrColor);
                  }}
                  style={{marginHorizontal: 5}}>
                  <Image
                    style={styles.swichButton}
                    source={color[42] === 0 ? swichLeft : swichRight}
                  />
                </TouchableOpacity>
                <Text style={{fontSize: 10}}>On</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={[styles.inputTitle, {width: width / 3.3}]}>
          Ng??y ??m l???ch
        </Text>
        <View style={styles.inputCont}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={{marginTop: 14, width: width / 6.5}}>Ng??y:</Text>
              <Text style={{marginTop: 14, width: width / 6.5}}>Th??ng:</Text>
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
            </View>
          </View>

          <View style={{flexDirection: 'row', marginLeft: 40}}>
            <View>
              <Text style={{marginTop: 14, width: width / 6.5}}>N??m:</Text>
              <Text style={{marginTop: 14, width: width / 4.5}}>D???u ch???m:</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setStatusModal({location: 11, status: true})}
                style={[
                  styles.itemColor,
                  {backgroundColor: rgbToHex(color[33], color[34], color[35])},
                ]}>
                <Text>{rgbToHex(color[33], color[34], color[35])}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatusModal({location: 12, status: true})}
                style={[
                  styles.itemColor,
                  {backgroundColor: rgbToHex(color[36], color[37], color[38])},
                ]}>
                <Text>{rgbToHex(color[36], color[37], color[38])}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[styles.inputTitle, {width: width / 5}]}>Nhi???t ?????</Text>
        <View style={styles.inputCont}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={{marginTop: 14, width: width / 6.5}}>Nhi???t ?????:</Text>
            </View>
            <View>
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

        <Text style={[styles.inputTitle, {width: width / 2.4}]}>
          M??u s???c s??? hi???n th???
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
              <Text style={[styles.reviewLineText2, {color: colorColon()}]}>
                :
              </Text>
              <Text
                style={[
                  styles.reviewLineText2,
                  {color: rgbToHex(color[18], color[19], color[20])},
                ]}>
                30
              </Text>
              <Text style={[styles.reviewLineText2, {color: colorColon()}]}>
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
                  {color: rgbToHex(color[36], color[37], color[38])},
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
                  {color: rgbToHex(color[36], color[37], color[38])},
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
                    color: rgbToHex(color[39], color[40], color[41]),
                    marginLeft: 10,
                  },
                ]}>
                35 ??C
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.inputTitle, {width: width / 3.5}]}>
          H???n gi??? b???t/t???t
        </Text>
        <View style={[styles.inputCont, {flexDirection: 'column'}]}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 10}}>Off</Text>
            <TouchableOpacity
              onPress={() => {
                var arrColor = [...color];
                arrColor[43] = color[43] === 0 ? 1 : 0;
                setColor(arrColor);
              }}
              style={{marginHorizontal: 5}}>
              <Image
                style={styles.swichButton}
                source={color[43] === 0 ? swichLeft : swichRight}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 10}}>On</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{marginTop: 14, width: width / 6.5}}>B???t l??c:</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={Boolean(color[43])}
                spellCheck={false}
                autoCorrect={false}
                keyboardType={'number-pad'}
                style={styles.inputTime}
                onChangeText={text =>
                  setHourOn(!isNaN(parseInt(text)) ? parseInt(text) : '')
                }
                value={hourOn.toString()}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                maxLength={2}
              />
              <Text style={styles.timeText}>Gi???</Text>
              <TextInput
                editable={Boolean(color[43])}
                spellCheck={false}
                autoCorrect={false}
                keyboardType={'number-pad'}
                style={styles.inputTime}
                onChangeText={text =>
                  setMinOn(!isNaN(parseInt(text)) ? parseInt(text) : '')
                }
                value={minOn.toString()}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                maxLength={2}
              />
              <Text style={styles.timeText}>Ph??t</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={{marginTop: 14, width: width / 6.5}}>T???t l??c:</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={Boolean(color[43])}
                spellCheck={false}
                autoCorrect={false}
                keyboardType={'number-pad'}
                style={styles.inputTime}
                onChangeText={text =>
                  setHourOff(!isNaN(parseInt(text)) ? parseInt(text) : '')
                }
                value={hourOff.toString()}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                maxLength={2}
              />
              <Text style={styles.timeText}>Gi???</Text>
              <TextInput
                editable={Boolean(color[43])}
                spellCheck={false}
                autoCorrect={false}
                keyboardType={'number-pad'}
                style={styles.inputTime}
                onChangeText={text =>
                  setMinOff(!isNaN(parseInt(text)) ? parseInt(text) : '')
                }
                value={minOff.toString()}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                maxLength={2}
              />
              <Text style={styles.timeText}>Ph??t</Text>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                marginLeft: 10,
                width: width / 5,
                marginTop: 10,
                marginBottom: 10,
              },
            ]}
            onPress={() => {
              sendColor();
            }}>
            {loading ? Loading : <Text style={styles.buttonText}>G???i</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                marginLeft: 10,
                marginTop: 10,
                marginBottom: 10,
              },
            ]}
            onPress={() => {
              randomColor();
            }}>
            <Text style={styles.buttonText}>Random Color</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModal.status}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.inputTitleModal}>M?? m??u</Text>
            <View style={styles.inputContModal}>
              <Text style={{color: 'black', marginTop: 6, marginLeft: 15}}>
                #
              </Text>
              <TextInput
                spellCheck={false}
                autoCorrect={false}
                style={styles.inputModal}
                onChangeText={text => setInputColor(text)}
                value={inputColor}
                underlineColorAndroid="transparent"
                letterSpacing={0.5}
                autoCapitalize="none"
                maxLength={6}
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
                setInputColor(color.slice(1, 7));
              }}
            />

            <View style={styles.buttonCont}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#adadad'}]}
                onPress={() => {
                  setStatusModal({location: 0, status: false});
                }}>
                <Text style={styles.buttonText}>Tho??t</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {marginLeft: 20}]}
                onPress={() => {
                  saveColor();
                }}>
                <Text style={styles.buttonText}>L??u</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  swichButton: {
    width: width / 12,
    height: width / 12,
  },
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
    marginLeft: 5,
  },
  inputTime: {
    borderColor: '#8a8a8a',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'white',
    width: width / 10,
    height: 25,
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    textAlign: 'center',
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
    width: width / 2.6,
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
  timeText: {
    marginTop: 12,
    marginLeft: 5,
    marginRight: 12,
  },
});
