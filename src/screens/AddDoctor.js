import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Color, Fonts} from '../theme';
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  HelperText,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {postData, postDataAndImage} from '../API';
import {Picker} from '@react-native-picker/picker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import SuccessModal from '../components/modals/SuccessModal';
import MapModal from '../components/modals/MapModal';

export default function AddDoctor({navigation}) {
  const theme = {colors: {text: '#000', background: '#aaaaaa50'}}; // for text input

  let defaultSchedule = [
    {
      day: 'Sunday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: false,
    },
    {
      day: 'Monday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: true,
    },
    {
      day: 'Tuesday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: true,
    },
    {
      day: 'Wednesday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: true,
    },
    {
      day: 'Thursday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: true,
    },
    {
      day: 'Friday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: true,
    },
    {
      day: 'Saturday',
      start_time: new Date(new Date().setHours(10, 0, 0)),
      end_time: new Date(new Date().setHours(19, 0, 0)),
      checked: true,
    },
  ];

  const user = useSelector(state => state.user);

  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('Male');
  const [dob, setDob] = React.useState(new Date());
  const [maritalStatus, setMaritalStatus] = React.useState('Married');
  const [pinCode, setPinCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [adhar, setAdhar] = React.useState('');
  const [doctorContact, setDoctorContact] = React.useState('');
  const [clinicContact, setClinicContact] = React.useState('');
  const [registration_number, setRegistration_number] = React.useState('');
  const [specialization, setSpecialization] = React.useState('');
  const [Degree, setDegree] = React.useState('');
  const [collegename, setCollegename] = React.useState('');
  const [year_of_passout, setYear_of_passout] = React.useState('');
  const [college_location, setCollege_location] = React.useState('');
  const [award_name, setAward_name] = React.useState('');
  const [certifications, setCertifications] = React.useState('');
  const [certList, setCertList] = React.useState([]);
  const [award_giving_authority_name, setAward_giving_authority_name] =
    React.useState('');
  const [awardList, setAwardList] = React.useState([]);
  const [achievement_year, setAchievement_year] = React.useState('');
  const [achievement_specialization, setAchievement_specialization] =
    React.useState('');
  const [achievementList, setAchievementList] = React.useState([]);
  const [checked, setChecked] = React.useState(false);
  const [languages, setLanguages] = React.useState('');
  const [facilities, setFacilities] = React.useState('');
  const [avgTime, setAvgTime] = React.useState('');
  const [clinicLocations, setClinicLocations] = React.useState([]);
  const [clinicLocationText, setClinicLocationText] = React.useState('');
  const [schedule, setSchedule] = React.useState(defaultSchedule);
  const [doctor_fees, setDoctor_fees] = React.useState('');
  const [dolo_id, setDolo_id] = React.useState('');
  const [doctorPic, setDoctorPic] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showMap, setShowMap] = React.useState(false);
  const _scrollRef = React.useRef(null);

  const addDoctor = async () => {
    if (doctorPic === '' || name === '' || email === '' || dolo_id === '') {
      Alert.alert('Error', 'Please fill the required fields');
      return;
    }
    setLoading(true);

    let body = [
      {
        user_id: user?.userid,
        name,
        date_of_birth: dob,
        marital_status: maritalStatus,
        gender,
        email,
        fees: doctor_fees,
        do_lo_id: dolo_id,
        doctorContact,
        clinic_contact: clinicContact,
        location,
        pincode: pinCode,
        adhar,
        registration_number,
        schedule: schedule.map(item => {
          return {
            day: item.day,
            start_time: item.start_time.toString(),
            end_time: item.end_time.toString(),
            checked: item.checked,
          };
        }),
        avgTime,
        clinicLocations:
          clinicLocations.length > 0 ? clinicLocations : [clinicLocationText],
        facilities,
        specialization,
        Degree,
        collegename,
        year_of_passout,
        college_location,
        feeconsultation: checked,
        languages,
        awardList:
          awardList.length > 0
            ? awardList
            : [
                {
                  award_name,
                  award_giving_authority_name,
                },
              ],
        certList: certList.length > 0 ? certList : [certifications],
        achievementList:
          achievementList.length > 0
            ? achievementList
            : [{achievement_specialization, achievement_year}],
        profileimage: doctorPic.data,
      },
    ];
    // console.log(formData);
    // let result = await postDataAndImage('agent/doctorcreate', formData);
    let result = await postData('agent/doctorcreate', body);
    // console.log(result);
    if (!result.success) {
      if (result.msg === 'Validation Error.') {
        Alert.alert('Error', 'Doctor already exists');
        setLoading(false);
        return;
      }
    }
    if (result.success) {
      setShowModal(true);
      setLoading(false);
    } else {
      setLoading(false);
      ToastAndroid.show(
        'Something Went Wrong! Please try again.',
        ToastAndroid.SHORT,
      );
    }
    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const setScheduleDay = index => {
    let temp = [...schedule];
    // console.log('temp', temp[index]['day']);
    if (temp[index]['checked']) {
      temp[index]['checked'] = false;
      setSchedule(temp);
    } else {
      temp[index]['checked'] = true;
      setSchedule(temp);
    }
  };

  const setScheduleStartTime = index => {
    let temp = [...schedule];
    DateTimePickerAndroid.open({
      value: temp[index]['start_time'],
      onChange: (event, date) => {
        temp[index]['start_time'] = date;
        setSchedule(temp);
      },
      mode: 'time',
      is24Hour: false,
    });
  };

  const setScheduleEndTime = index => {
    let temp = [...schedule];
    DateTimePickerAndroid.open({
      value: temp[index]['end_time'],
      onChange: (event, date) => {
        temp[index]['end_time'] = date;
        setSchedule(temp);
      },
      mode: 'time',
      is24Hour: false,
    });
  };

  const openDobCalender = () => {
    DateTimePickerAndroid.open({
      value: dob,
      onChange: (event, date) => {
        setDob(date);
      },
      mode: 'date',
      is24Hour: false,
    });
  };

  const addClinicLocations = () => {
    setClinicLocations(prev => [...prev, clinicLocationText]);
    setClinicLocationText('');
  };

  const addAwards = () => {
    setAwardList(prev => [
      ...prev,
      {
        award_name,
        award_giving_authority_name,
      },
    ]);
    setAward_name('');
    setAward_giving_authority_name('');
  };

  const addAchievements = () => {
    setAchievementList(prev => [
      ...prev,
      {
        achievement_specialization,
        achievement_year,
      },
    ]);
    setAchievement_year('');
    setAchievement_specialization('');
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
      includeBase64: true,
    }).then(image => {
      setDoctorPic(image);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
      includeBase64: true,
    }).then(image => {
      setDoctorPic(image);
    });
  };

  const selectProfilePic = () => {
    Alert.alert(
      'Select Profile Picture from',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Camera',
          onPress: () => takePhotoFromCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => choosePhotoFromLibrary(),
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const getDateValue = date => {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onPrimaryPress = () => {
    setName('');
    setGender('Male');
    setDob(new Date());
    setMaritalStatus('Married');
    setPinCode('');
    setDoctor_fees('');
    setDolo_id('');
    setEmail('');
    setDoctorContact('');
    setClinicContact('');
    setLocation('');
    setAdhar('');
    setRegistration_number('');
    setSchedule(defaultSchedule);
    setAvgTime('');
    setClinicLocations([]);
    setClinicLocationText('');
    setFacilities('');
    setSpecialization('');
    setDegree('');
    setCollegename('');
    setYear_of_passout('');
    setCollege_location('');
    setChecked(false);
    setLanguages('');
    setAwardList([]);
    setAward_name('');
    setAward_giving_authority_name('');
    setCertList([]);
    setCertifications('');
    setAchievementList([]);
    setAchievement_specialization('');
    setAchievement_year('');
    setDoctorPic('');
    _scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        title="Doctor Added Successfully"
        primaryBtnText="Add More"
        onPrimaryPress={() => onPrimaryPress()}
        secondaryBtnText="Go Back"
        onSecondaryPress={() => {
          setShowModal(false);
          navigation.goBack();
        }}
      />
      <MapModal
        setLocation={setLocation}
        onRequestClose={() => setShowMap(false)}
        onPress={() => {
          setShowMap(false);
          // navigation.goBack();
        }}
        visible={showMap}
      />
      <View style={{flexDirection: 'row', padding: 20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={32}
            color={Color.black}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Create Doctor Profile 📝</Text>
      </View>
      <ScrollView
        ref={_scrollRef}
        style={styles.form}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={{alignSelf: 'center'}}>
            <Avatar.Image
              size={100}
              style={{alignSelf: 'center'}}
              source={{
                uri: doctorPic?.path
                  ? doctorPic?.path
                  : 'https://www.w3schools.com/w3images/avatar6.png',
              }}
            />
            <Button
              color={Color.primary}
              onPress={() => selectProfilePic()}
              style={{
                margin: 10,
                borderColor: Color.primary,
              }}
              mode="outlined">
              Add Profile Pic*
            </Button>
          </View>
          <Text
            style={{
              color: Color.red,
              fontSize: 12,
              fontFamily: Fonts.primaryRegular,
              marginVertical: 10,
            }}>
            All fields markrd with * is required to fill.
          </Text>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setName(text)}
            value={name}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Gender</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <TouchableOpacity
              onPress={() => setGender('Male')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  gender == 'Male' ? `${Color.primary}50` : '#aaaaaa50',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender('Female')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  gender == 'Female' ? `${Color.primary}50` : '#aaaaaa50',
                marginLeft: 5,
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender('Others')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  gender == 'Others' ? `${Color.primary}50` : '#aaaaaa50',
                marginLeft: 5,
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Others
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            theme={theme}
            dense
            editable={false}
            onChangeText={text => setDob(text)}
            forceTextInputFocus={false}
            right={
              <TextInput.Icon
                icon="calendar"
                color={Color.primary}
                onPress={openDobCalender}
              />
            }
            value={getDateValue(dob)}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Marital Status</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <TouchableOpacity
              onPress={() => setMaritalStatus('Married')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  maritalStatus == 'Married'
                    ? `${Color.primary}50`
                    : '#aaaaaa50',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Married
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMaritalStatus('Single')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  maritalStatus == 'Single'
                    ? `${Color.primary}50`
                    : '#aaaaaa50',
                marginLeft: 5,
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Single
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View style={{marginRight: 10, flex: 1}}>
            <Text style={styles.label}>Doctor Fees</Text>
            <TextInput
              theme={theme}
              dense
              keyboardType="numeric"
              onChangeText={text => setDoctor_fees(text)}
              value={doctor_fees}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>DOLO ID</Text>
            <TextInput
              theme={theme}
              dense
              onChangeText={text => setDolo_id(text)}
              value={dolo_id}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Email*</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setEmail(text)}
            value={email}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View style={{marginRight: 10, flex: 1}}>
            <Text style={styles.label}>Doctor Contact</Text>
            <TextInput
              theme={theme}
              dense
              keyboardType="numeric"
              onChangeText={text => setDoctorContact(text)}
              value={doctorContact}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Clinic Contact</Text>
            <TextInput
              theme={theme}
              dense
              keyboardType="numeric"
              onChangeText={text => setClinicContact(text)}
              value={clinicContact}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Location</Text>
          {location.length > 0 && (
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.primarySemiBold,
                color: Color.black,
              }}>
              {location}
            </Text>
          )}
          {/* <TextInput
            theme={theme}
            dense
            multiline
            numberOfLines={4}
            onChangeText={text => setLocation(text)}
            value={location}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          /> */}
          <Button
            mode="contained"
            onPress={() => setShowMap(true)}
            color={Color.primary}
            dark
            style={{marginTop: 10}}>
            Locate on Map
          </Button>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Pin Code</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setPinCode(text)}
            value={pinCode}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View style={{marginRight: 10, flex: 1}}>
            <Text style={styles.label}>Aadhar Number</Text>
            <TextInput
              theme={theme}
              dense
              keyboardType="numeric"
              onChangeText={text => setAdhar(text)}
              value={adhar}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Registration Number</Text>
            <TextInput
              theme={theme}
              dense
              onChangeText={text => setRegistration_number(text)}
              value={registration_number}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text
            style={{
              ...styles.sectionTitle,
              paddingVertical: 15,
              marginTop: 10,
            }}>
            Clinic Details
          </Text>
          <Text style={styles.label}>Clinic Schedule</Text>
          {schedule.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Checkbox
                  uncheckedColor={Color.grey}
                  color={Color.primary}
                  onPress={() => setScheduleDay(index)}
                  status={item.checked ? 'checked' : 'unchecked'}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setScheduleDay(index)}>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: Fonts.primaryRegular,
                      marginHorizontal: 5,
                    }}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={item.checked ? 0.5 : 1}
                  onPress={() =>
                    item.checked ? setScheduleStartTime(index) : null
                  }>
                  <Text
                    style={{
                      color: item.checked ? Color.black : '#ccc',
                      fontSize: 16,
                      fontFamily: Fonts.primaryRegular,
                    }}>
                    {item.start_time
                      .toLocaleTimeString()
                      .replace(
                        item.start_time.toLocaleTimeString().slice(-6, -3),
                        '',
                      )}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    marginHorizontal: 20,
                    fontFamily: Fonts.primaryRegular,
                    color: item.checked ? Color.black : '#ccc',
                  }}>
                  -
                </Text>
                <TouchableOpacity
                  activeOpacity={item.checked ? 0.5 : 1}
                  onPress={() =>
                    item.checked ? setScheduleEndTime(index) : null
                  }>
                  <Text
                    style={{
                      color: item.checked ? Color.black : '#ccc',
                      fontSize: 16,
                      fontFamily: Fonts.primaryRegular,
                    }}>
                    {item.end_time
                      .toLocaleTimeString()
                      .replace(
                        item.end_time.toLocaleTimeString().slice(-6, -3),
                        '',
                      )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Avg. Time per patient (in mins.)</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setAvgTime(text)}
            value={avgTime}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Clinic Address</Text>
          {clinicLocations.length > 0 &&
            clinicLocations.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  marginVertical: 5,
                  justifyContent: 'space-between',
                  backgroundColor: `${Color.primary}50`,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.primarySemiBold,
                    color: Color.black,
                  }}>
                  {item}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    let temp = [...clinicLocations];
                    temp.splice(index, 1);
                    setClinicLocations(temp);
                  }}>
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ))}
          <TextInput
            theme={theme}
            dense
            multiline
            numberOfLines={4}
            onChangeText={text => setClinicLocationText(text)}
            value={clinicLocationText}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
          <Button
            mode="contained"
            onPress={addClinicLocations}
            color={Color.primary}
            dark
            style={{marginTop: 10}}>
            Add
          </Button>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Facilities</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setFacilities(text)}
            value={facilities}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
          <HelperText
            type="info"
            padding="none"
            visible={true}
            style={{
              fontFamily: Fonts.primaryRegular,
              fontSize: 12,
              color: Color.grey,
            }}>
            Enter different facilities seperated by commas.
          </HelperText>
        </View>
        <View style={{marginTop: 15}}>
          <Text
            style={{
              ...styles.sectionTitle,
              paddingVertical: 15,
              marginTop: 10,
            }}>
            Education Details
          </Text>
          <Text style={styles.label}>Specialization</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setSpecialization(text)}
            value={specialization}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Degree</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setDegree(text)}
            value={Degree}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>College Name</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setCollegename(text)}
            value={collegename}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View style={{marginRight: 10, flex: 1}}>
            <Text style={styles.label}>Year of Passout</Text>
            <TextInput
              theme={theme}
              dense
              keyboardType="numeric"
              onChangeText={text => setYear_of_passout(text)}
              value={year_of_passout}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>College Location</Text>
            <TextInput
              theme={theme}
              dense
              onChangeText={text => setCollege_location(text)}
              value={college_location}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text
            style={{
              ...styles.sectionTitle,
              paddingVertical: 15,
              marginTop: 10,
            }}>
            Miscellaneous
          </Text>
          <Text style={styles.label}>Fee Consultation</Text>
          <Text
            style={{
              fontFamily: Fonts.primaryRegular,
              fontSize: 12,
              color: Color.grey,
              marginBottom: 5,
            }}>
            Is he/she willing to take consultation fee through our app ?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setChecked(true)}
              style={{
                ...styles.radioStyle,
                backgroundColor: `${Color.green}50`,
                marginRight: 10,
              }}>
              {checked && (
                <MaterialCommunityIcons
                  name="check"
                  size={26}
                  color={Color.green}
                  style={{
                    marginHorizontal: 10,
                    position: 'absolute',
                    top: 10,
                    left: 10,
                  }}
                />
              )}
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChecked(false)}
              style={{
                ...styles.radioStyle,
                backgroundColor: `${Color.red}50`,
              }}>
              {!checked && (
                <MaterialCommunityIcons
                  name="close"
                  size={26}
                  color={Color.red}
                  style={{
                    marginHorizontal: 10,
                    position: 'absolute',
                    top: 10,
                    left: 10,
                  }}
                />
              )}
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Languages</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setLanguages(text)}
            value={languages}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
          <HelperText
            type="info"
            padding="none"
            visible={true}
            style={{
              fontFamily: Fonts.primaryRegular,
              fontSize: 12,
              color: Color.grey,
            }}>
            Enter different languages seperated by commas.
          </HelperText>
        </View>

        <View style={{marginTop: 15}}>
          <Text
            style={{
              ...styles.sectionTitle,
              paddingVertical: 15,
              marginTop: 10,
            }}>
            Awards & Recognitions
          </Text>
          {awardList.length > 0 &&
            awardList.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginVertical: 5,
                    justifyContent: 'space-between',
                    backgroundColor: `${Color.primary}50`,
                    borderRadius: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: Fonts.primarySemiBold,
                        color: Color.black,
                      }}>
                      {item.award_name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.primaryRegular,
                        color: Color.black,
                      }}>
                      {item.award_giving_authority_name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      let arr = [...awardList];
                      arr.splice(index, 1);
                      setAwardList(arr);
                    }}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          <Text style={styles.label}>Award Names</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setAward_name(text)}
            value={award_name}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Award Giving Authorities</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setAward_giving_authority_name(text)}
            value={award_giving_authority_name}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <Button
          mode="contained"
          onPress={addAwards}
          color={Color.primary}
          dark
          style={{marginTop: 10}}>
          Add Award
        </Button>
        <View style={{marginTop: 15}}>
          <Text
            style={{
              ...styles.sectionTitle,
              paddingVertical: 15,
              marginTop: 10,
            }}>
            Certifications
          </Text>
          {certList.length > 0 &&
            certList.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginVertical: 5,
                    justifyContent: 'space-between',
                    backgroundColor: `${Color.primary}50`,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.primarySemiBold,
                      color: Color.black,
                    }}>
                    {item}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      let arr = [...certList];
                      arr.splice(index, 1);
                      setCertList(arr);
                    }}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          <Text style={styles.label}>Certifications</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setCertifications(text)}
            value={certifications}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
          <Button
            mode="contained"
            onPress={() => {
              setCertList(prev => [...prev, certifications]);
              setCertifications('');
            }}
            color={Color.primary}
            dark
            style={{marginTop: 10}}>
            Add Certificate
          </Button>
        </View>
        <View style={{marginTop: 15}}>
          <Text
            style={{
              ...styles.sectionTitle,
              paddingVertical: 15,
              marginTop: 10,
            }}>
            Achievements
          </Text>
          {achievementList.length > 0 &&
            achievementList.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginVertical: 5,
                    justifyContent: 'space-between',
                    backgroundColor: `${Color.primary}50`,
                    borderRadius: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.primarySemiBold,
                        color: Color.black,
                      }}>
                      {item.achievement_specialization},{' '}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.primaryRegular,
                        color: Color.black,
                      }}>
                      {item.achievement_year}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      let arr = [...achievementList];
                      arr.splice(index, 1);
                      setAchievementList(arr);
                    }}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          <Text style={styles.label}>Achievement Specialization</Text>
          <TextInput
            theme={theme}
            dense
            onChangeText={text => setAchievement_specialization(text)}
            value={achievement_specialization}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Achievement Year</Text>
          <TextInput
            theme={theme}
            dense
            keyboardType="numeric"
            onChangeText={text => setAchievement_year(text)}
            value={achievement_year}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
          <Button
            mode="contained"
            onPress={addAchievements}
            color={Color.primary}
            dark
            style={{marginTop: 10}}>
            Add
          </Button>
        </View>
        <Button
          style={{
            backgroundColor: Color.primary,
            marginTop: 60,
            marginBottom: 10,
          }}
          contentStyle={{height: 55, alignItems: 'center'}}
          dark
          loading={loading}
          mode="contained"
          onPress={() => addDoctor()}>
          Submit Profile
        </Button>
      </ScrollView>
    </View>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    paddingHorizontal: 20,
    color: Color.black,
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    color: Color.black,
    fontFamily: Fonts.primaryBold,
    marginBottom: 10,
  },
  form: {
    paddingHorizontal: 20,
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    color: '#ff9000',
  },
  pickerStyle: {
    width: '100%',
    marginTop: 5,
    borderBottmColor: '#000',
    borderBottomWidth: 1,
    backgroundColor: '#E0E0E070',
    height: 50,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  radioStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    // width: '49%',
    padding: 12,
    borderRadius: 5,
  },
});
