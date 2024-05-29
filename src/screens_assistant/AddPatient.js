import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Color, Fonts, Dimension} from '../theme';
import SuccessModal from '../components/modals/SuccessModal';
import {Avatar, Button, TextInput} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {postData} from '../API';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AddpatientSuccessModal from '../components/modals/AddPatientSuccessModal';
import Reciept from '../components/Reciept';
import {errorToast} from '../components/toasts';

const {width, height} = Dimension;
export default function AddPatient({navigation, route}) {
  const theme = {colors: {text: '#000', background: '#aaaaaa50'}}; // for text input

  const user = useSelector(state => state.user);
    console.log('seleapp==>',route.params);
  const itemData = route.params?.item;

  const [category, setCategory] = React.useState(itemData?.category || '');
  const [shiftName, setShiftName] = React.useState(
    itemData?.shift_name || 'Morning',
  );
  const [name, setName] = React.useState(itemData?.patient_name || '');
  const [age, setAge] = React.useState(itemData?.age || '');
  // const [ageType, setAgeType] = React.useState(itemData?.ageType || 'Years');
  const [weight, setWeight] = React.useState(itemData?.weight || '');
  const [weightType, setWeightType] = React.useState(
    itemData?.weightType || 'Kg',
  );
  const [gender, setGender] = React.useState(
    itemData?.gender.toLowerCase() || 'male',
  );
  const [mobileNo, setMobileNo] = React.useState(itemData?.mobile || '');

  const [showModal, setShowModal] = React.useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [createTime, setCreateTime] = React.useState('');
  const [currentAge, setCurrentAge] = React.useState('');
  const [createDate, setCreateDate] = React.useState(
    itemData?.create_date || '',
  );
  const [modalData, setModalData] = React.useState('');
  const [docorName, setDoctorName] = React.useState('');
  const _scrollRef = React.useRef(null);
  const _inputRef = React.useRef(null);

  const onSecondaryPress = () => {
   setCategory('');
    setName('');
    setAge('');
    //  setAgeType('Years');
    setWeight('');
     setWeightType('Kg');
    setGender('male');
    setMobileNo('');
    setShowModal(false);
    setCreateDate('');
    setShiftName('Morning');
    _scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    _inputRef.current.blur();
  
  
  };

  const onSubmit = async () => {
    setLoading(true);

    var addbody = {
      doctor_id: user?.doctor_id,
      assistant_id: user?.userid,
      category,
      patient_name: name,
      age,
      //  agetype: ageType,
      weight,
      weighttype: weightType,
      gender,
      mobile: mobileNo,
      status: 0,
      create_date: createDate,
      shift_name: shiftName,
    };
    var editbody = {
      id: itemData?.id,
      doctor_id: user?.doctor_id,
      assistant_id: user?.userid,
      category: category,
      patient_name: name,
      age,
      // agetype: ageType,
      weight,
      weighttype: weightType,
      gender,
      mobile: mobileNo,
      status: 0,
      // create_date:createDate,
      shift_name: shiftName,
    };
    const apiUrl =
      route.params?.type !== 'add' ? 'appointmentupdate' : 'createappointment';
    const body = route.params?.type !== 'add' ? editbody : addbody;
    const result = await postData(apiUrl, body);
    console.log('res==', result);
    if (result.success) {
      setShowModal(true);
      setModalData(result.data);
      getAge(result.data?.age);
      setDoctorName(result?.doctorname);
    }
    else{
      errorToast(result.message)
    }
    setLoading(false);
  };

  const checkValidation = () => {
    if (mobileNo.length < 10) {
      errorToast('Please enter minimum 10 digit mobile number');
    } else {
      onSubmit();
    }
  };

  const getAge = dateString => {
    var dates = dateString.split('/');
    var d = new Date();

    var userday = dates[0];
    var usermonth = dates[1];
    var useryear = dates[2];

    var curday = d.getDate();
    var curmonth = d.getMonth() + 1;
    var curyear = d.getFullYear();

    if(curyear > useryear ){
      var age = curyear - useryear;
    }

    if(curyear == useryear && curmonth > usermonth){
     
      var age = curmonth - usermonth;
    }

    if(curyear == useryear && curmonth == usermonth && curday >= userday){
     
      var age = curday - userday;
    }

  //  var age = curyear - useryear;

    // if (curmonth < usermonth || (curmonth == usermonth && curday < userday)) {
    //   age--;
    // }

    
   
    return setCurrentAge(age);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  FormatDate = async data => {
    let dateTimeString =
      data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();

    hideDatePicker();
    setAge(dateTimeString);

    return dateTimeString; // It will look something like this 3-5-2021 16:23
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

//   const printHTML = async () => {
//     await RNPrint.print({
//       html:
      

//         // '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head><style>tr {line-height:8px; }</style><body style="font-size:8px;"><div class="container" style="width: fit-content; width: min-content; height:min-content; border: 1px solid black; border-radius: 17px; background-color: aliceblue;"><p> Dr.' +
//         // docorName +
//         // '</p><div class="table-responsive-sm"><table class="table table-borderless"><div class="row" style="border: 1px solid black; width: 90px; left: 26%; border-radius: 5px; text-align: center; margin-left: 17%;"><br><br><h3 class="token_no">' +
//         // modalData.token_no +
//         // '</h3><strong>TOKEN NO.</strong></div><tbody><tr><th scope="col">Category</th><th scope="col">:</th><td>' +
//         // modalData.category +
//         // '</td></tr><tr><th scope="col">Name</th><th>:</th><td>' +
//         // modalData.patient_name +
//         // '</td></tr><tr><th scope="col">Age</th><th>:</th><td>' +
//         // currentAge +
//         // ' Years' +
//         // '</td></tr><tr><th scope="col">Weight</th><th>:</th><td>' +
//         // modalData.weight +
//         // modalData.weighttype +
//         // '</td></tr><tr><th scope="col">Gender</th><th>:</th><td>' +
//         // modalData.gender +
//         // '</td></tr><tr><th scope="col">Time</th><th>:</th><td>' +
        
//         // `${new Date(modalData.created_at).toLocaleTimeString().replace(new Date(modalData.created_at).toLocaleTimeString().slice(-6, -3),
//         //   '',)},${new Date(modalData.created_at).getDate()}/${new Date(modalData.created_at).getMonth()+1}/${new Date(modalData.created_at).getFullYear()}` +
//         // '</td></tr></tbody></table></div></div></body></html>',



// // '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head><style>body{font-weight:bold;font-variant: small-caps;}h5{font-weight:bold;font-variant: small-caps;}</style><body><div class="container" style="width: fit-content; border: 1px solid black; border-radius: 17px; "><div class="table-responsive-sm"><table class="table table-borderless " style=" font-weight:bold;"><h5 style="font-size:10px;    margin-top: 9px;margin-bottom: -23px;">DoloApp</h5><h6 class="text-center mt-3" style="font-weight: bolder; font-size:20px">'+modalData.token_no+'</h6><tbody style="line-height: 0.1;"><tr><th scope="col">Name</th><th>:</th><td>'+modalData.patient_name+'</td></tr><tr><th scope="col">Age</th><th>:</th><td>'+currentAge+'Years'+'</td></tr><tr><th scope="col">Weight</th><th>:</th><td>'+modalData.weight+modalData.weighttype+'</td></tr><tr></tr><th scope="col">Gender</th><th>:</th><td>'+modalData.gender+'</td></tr><tr><th scope="col">Category</th><th scope="col">:</th><td>'+modalData.category+'</td></tr><tr><th scope="col">Time</th><th>:</th><td>'+`${new Date(modalData.created_at).toLocaleTimeString().replace(new Date(modalData.created_at).toLocaleTimeString().slice(-6, -3),'',)},</td></tr><tr><td></td><td></td><td>${new Date(modalData.created_at).getDate()}/${new Date(modalData.created_at).getMonth()+1}/${new Date(modalData.created_at).getFullYear()}`+'</td></tr></tbody></table><p style=" font-weight:bold;font-variant: small-caps;  line-height: 0.1;"> Dr. '+docorName+'</p><h5 style="font-size:10px;margin-left: 212px;">DoloApp</h5></div></div></body></html>'

// // '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head><style>body{font-weight:bold;font-variant: small-caps;}.table>:not(caption)>>{ padding: 0rem 0.1rem;}h5{font-weight:bold;font-variant: small-caps;}</style><body><div class="container" style="width: fit-content border: 1px solid black; border-radius: 17px; "><div class="table-responsive-sm"><table class="table table-borderless " style=" font-weight:bold;"><h5 style="font-size:10px;    margin-top: 9px;margin-bottom: -23px;">Dolo App</h5><h6 class="text-center mt-1" style="font-weight: bolder; font-size:20px">'+modalData.token_no+'</h6><tbody><tr><th scope="col">Name</th><th>:</th><td style="width:auto;">'+modalData.patient_name+' </td></tr><tr><th scop="col">Age</th><th>:</th><td>'+modalData.agevalue+'</td></tr><tr><th scope="col">Weight</th><th>:</th><td>'+modalData.weight+modalData.weighttype+'</td></tr><tr></tr><th scope="col">Gender</th><th>:</th><td>'+modalData.gender+'</td></tr><tr><th scope="col">Category</th><th scope="col">:</th><td>'+modalData.category+'</td></tr><tr><th scope="col">Time</th><th>:</th><td>'+`${new Date(modalData.created_at).toLocaleTimeString().replace(new Date(modalData.created_at).toLocaleTimeString().slice(-6, -3),'',)},</td></tr><tr><td></td><td></td><td>${new Date(modalData.created_at).getDate()}/${new Date(modalData.created_at).getMonth()+1}/${new Date(modalData.created_at).getFullYear()}`+'</td></tr></tbody></table><p style=" font-weight:bold;font-variant: small-caps; line-height: 0.1;"> Dr. '+docorName+'</p><h5 style="font-size:10px;margin-left: 160px;">Dolo App</h5></div></div></body></html>'

// '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head><style>body{font-weight:bold;font-variant: small-caps;}.table>:not(caption)>*>*{ padding: 0rem 0.1rem;}h5{font-weight:bold;font-variant: small-caps;}</style><body><div class="container" style="width: 232px; border: 1px solid black; border-radius: 17px; "><div class="table-responsive-sm"><table class="table table-borderless " style=" font-weight:bold;"><h5 style="font-size:10px;    margin-top: 9px;margin-bottom: -23px;">Dolo App</h5><h6 class="text-center mt-1" style="font-weight: bolder; font-size:20px">'+modalData.token_no+'</h6><tbody><tr><th scope="col">Name</th><th>:</th><td style="width:155px;">'+modalData.patient_name+' </td></tr><tr>   <th scop="col">Age</th>   <th>:</th><td>'+modalData.agevalue+'</td></tr><tr><th scope="col">Weight</th><th>:</th><td>'+modalData.weight+modalData.weighttype+'</td></tr><tr></tr><th scope="col">Gender</th><th>:</th><td>'+modalData.gender+'</td></tr><tr>   <th scope="col">Category</th>   <th scope="col">:</th>   <td>'+modalData.category+'</td></tr><tr>   <th scope="col">Time</th>   <th>:</th>   <td>'+`${new Date(modalData.created_at).toLocaleTimeString().replace(new Date(modalData.created_at).toLocaleTimeString().slice(-6, -3),'',)},</td></tr><tr><td></td><td></td><td>${new Date(modalData.created_at).getDate()}/${new Date(modalData.created_at).getMonth()+1}/${new Date(modalData.created_at).getFullYear()}`+'</tr></tbody></table><p style=" font-weight:bold;font-variant: small-caps; line-height: 0.1;"> Dr. '+docorName+'</p><h5 style="font-size:10px;margin-left: 160px;">Dolo App</h5></div></div></body></html>'

//     });
//   };

  return (
    <View style={styles.container}>
      <AddpatientSuccessModal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        title={
          route.params?.type !== 'add'
            ? 'Patient Details Updated'
            : 'Patient Added Successfully'
        }
        primaryBtnText={
          route.params?.type !== 'add'
            ? 'Edit More Details'
            : 'ADD MORE PATIENT'
        }
        // onPrimaryPress={() => onPrimaryPress()}
        onPrimaryPress={() => {
          setShowModal(false);
          navigation.goBack();
        }}
        // secondaryBtnText="Go Back"
        onSecondaryPress={() => {
         {route.params?.type == 'add' ?
          onSecondaryPress()
          : setShowModal(false)
          _scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
         
        }
       
        }}
        category={modalData.category}
        patient_name={modalData.patient_name}
        age={modalData.agevalue}
        // agetype={modalData.agetype}
        weight={modalData.weight}
        weightType={modalData.weighttype}
        gender={modalData.gender}
        doctor_name={docorName}
        // time={
        //   new Date(modalData.created_at).getDate() /
        //   new Date(modalData.created_at).getMonth() /
        //   new Date(modalData.created_at).getFullYear()
        // }
        time={`${new Date(modalData.created_at).toLocaleTimeString().replace(new Date(modalData.created_at).toLocaleTimeString().slice(-6, -3),
          '',)},\n${new Date(modalData.created_at).getDate()}/${new Date(
          modalData.created_at,
        ).getMonth()+1}/${new Date(modalData.created_at).getFullYear()}`}
        //  weight_type={modalData.weighttype}
        // onPrintPress={() => printHTML()}
        token_no={modalData.token_no}
      />
      <View style={{flexDirection: 'row', padding: 20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={32}
            color={Color.black}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {route.params?.type == 'add' ? 'Add New Patient' : 'Edit Patient'}
        </Text>
      </View>
      <ScrollView
        ref={_scrollRef}
        style={styles.form}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        {/* {route.params?.type == 'add' && */}
        <View>
          <Text style={styles.label}>Shift Name</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <TouchableOpacity
              onPress={() => setShiftName('Morning')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  shiftName == 'Morning' ? `${Color.primary}50` : '#aaaaaa50',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Morning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShiftName('Evening')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  shiftName == 'Evening' ? `${Color.primary}50` : '#aaaaaa50',
                marginLeft: 5,
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: Fonts.primaryRegular,
                  lineHeight: 14 * 1.5,
                }}>
                Evening
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* } */}
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Category</Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              marginTop: 5,
              backgroundColor: '#aaaaaa50',
              //   height: 45,
            }}>
            <Picker
              mode="dropdown"
              style={{
                color: '#000',
              }}
              dropdownIconColor={Color.primary}
              selectedValue={category}
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
              <Picker.Item
                color={Color.grey}
                label="Select Category"
                value=""
              />
              <Picker.Item label="General" value="General" />
              <Picker.Item label="Vaccination" value="Vaccination" />
              <Picker.Item label="Revisit" value="Revisit" />
              <Picker.Item label="OtherCategory" value="OtherCategory" />
            </Picker>
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            theme={theme}
            dense
            style={{height: 45}}
            onChangeText={text => setName(text)}
            value={name}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        {/* <View style={{marginTop: 15,flexDirection: 'row',flex:1,justifyContent:'space-between'}}>
          
         
          <View
            style={{
              
              marginTop: 5,
              width:'49%'
            }}>
              <Text style={styles.label}>Age (Years)</Text>
            <TextInput
              theme={theme}
              dense
              style={{height: 45,}}
              keyboardType="numeric"
              onChangeText={text => setAge(text)}
              value={age}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            /> */}
        {/* <View
              style={{
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                marginLeft: 5,
                flex: 2,
                backgroundColor: '#aaaaaa50',
                //   height: 45,
              }}>
              <Picker
                mode="dropdown"
                style={{
                  color: '#000',
                }}
                dropdownIconColor={Color.primary}
                selectedValue={ageType}
                onValueChange={(itemValue, itemIndex) => setAgeType(itemValue)}>
                <Picker.Item color={Color.grey} label="Y/M/D" value="" />
                <Picker.Item label="Year" value="Year" />
                <Picker.Item label="Month" value="Months" />
                <Picker.Item label="Days" value="Days" />
              </Picker>
            </View> */}
        {/* </View>
          <View
            style={{
              
              marginTop: 5,
              width:'49%'
            }}>
              <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              theme={theme}
              dense
              style={{height: 45,}}
              keyboardType="numeric"
              onChangeText={text => setWeight(text)}
              value={weight}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
            </View>
        </View> */}
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>D.O.B</Text>

          {/* <TouchableOpacity > */}
          <TextInput
            ref={_inputRef}
            theme={theme}
            //keyboardType="numeric"
            dense
            onChangeText={setAge}
            value={age}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
            editable={false}
            right={
              <TextInput.Icon
                icon="calendar"
                color={Color.primary}
                onPress={() => showDatePicker()}
              />
            }
          />
          {/* </TouchableOpacity> */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={FormatDate}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.label}>Weight</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <TextInput
              theme={theme}
              dense
              style={{flex: 3, height: 45}}
              keyboardType="numeric"
              onChangeText={text => setWeight(text)}
              value={weight}
              mode="flat"
              underlineColor="#000"
              activeUnderlineColor={Color.primary}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                marginLeft: 5,
                flex: 2,
                backgroundColor: '#aaaaaa50',
                //   height: 45,
              }}>
              <Picker
                mode="dropdown"
                style={{
                  color: '#000',
                }}
                dropdownIconColor={Color.primary}
                selectedValue={weightType}
                onValueChange={(itemValue, itemIndex) =>
                  setWeightType(itemValue)
                }>
                <Picker.Item color={Color.grey} label="Kg/Grm" value="" />
                <Picker.Item label="Kg" value="Kg" />
                <Picker.Item label="Gram" value="Gram" />
              </Picker>
            </View>
          </View>
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
              onPress={() => setGender('male')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  gender == 'male' ? `${Color.primary}50` : '#aaaaaa50',
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
              onPress={() => setGender('female')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  gender == 'female' ? `${Color.primary}50` : '#aaaaaa50',
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
              onPress={() => setGender('others')}
              style={{
                ...styles.radioStyle,
                backgroundColor:
                  gender == 'others' ? `${Color.primary}50` : '#aaaaaa50',
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
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            ref={_inputRef}
            theme={theme}
            maxLength={10}
            style={{height: 45}}
            keyboardType="numeric"
            dense
            onChangeText={text => setMobileNo(text)}
            value={mobileNo}
            mode="flat"
            underlineColor="#000"
            activeUnderlineColor={Color.primary}
          />
        </View>
        {/* <View style={{marginTop:15}}>
          <Text style={styles.label}>Shift</Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              marginTop: 5,
              backgroundColor: '#aaaaaa50',
              //   height: 45,
            }}>
            <Picker
              mode="dropdown"
              style={{
                color: '#000',
              }}
              dropdownIconColor={Color.primary}
              selectedValue={shiftName}
              onValueChange={(itemValue, itemIndex) => setShiftName(itemValue)}>
              <Picker.Item
                color={Color.grey}
                label="Select Shift"
                value=""
              />
              <Picker.Item label="Morning" value="Morning" />
              <Picker.Item label="Evening" value="Evening" />
            
            </Picker>
          </View>
        </View> */}
        {route.params?.type === 'edit' && (
          <Text style={styles.sectionTitle}>Token No.{itemData?.token_no}</Text>
        )}
        <Button
          style={{
            backgroundColor: Color.primary,
            marginTop: 25,
            marginBottom: 10,
          }}
          contentStyle={{height: 55, alignItems: 'center'}}
          dark
          loading={loading}
          mode="contained"
          onPress={checkValidation}>
          Save & Approve
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
    color: Color.black,
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    color: Color.black,
    fontFamily: Fonts.primaryBold,
    marginTop: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 25,
    padding: 25,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    width: width * 0.7,
  },
  close_button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    width: width * 0.3,
    borderWidth: 1,
    borderColor: Color.black,
  },
  print_button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    width: width * 0.3,
    borderWidth: 1,
    borderColor: Color.black,
  },
  textStyle: {
    color: Color.black,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  card: {
    paddingTop: 10,

    //paddingHorizontal:10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.black,
    width: width * 0.4,
    alignSelf: 'center',
  },
  token_no: {
    fontSize: 45,
    fontFamily: Fonts.primaryBold,
    color: Color.black,
    textAlign: 'center',
  },
  token_no_txt: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Color.black,
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Color.black,
    // textAlign:'center',
    width: '28%',
  },
  title2: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Color.black,
    textAlign: 'center',
    width: '28%',
  },
  descr: {
    fontSize: 15,
    fontFamily: Fonts.primarySemiBold,
    color: Color.black,
    textAlign: 'auto',
    width: '50%',
  },
  details_container: {
    alignSelf: 'center',
    width: width * 0.7,
  },
});
