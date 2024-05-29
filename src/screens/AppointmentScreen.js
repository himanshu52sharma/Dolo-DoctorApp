import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {Button, Checkbox} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import DocProfilePlaceholder from '../placeholders/DocProfilePlaceholder';
import {Color, Dimension, Fonts} from '../theme';
import HomeScreen from './HomeScreen';
import {postData, getData} from '../API';
import {successToast, errorToast} from '../components/toasts';
import FeedbackDetails from './FeedbackDetails';
import FeedbackCard from '../components/FeedbackCard';
import SuccessModal from '../components/modals/SuccessModal';

export default function DoctorScreen({navigation, route}) {
  const appointment = route.params.item;

  const [appointmentData, setAppointmentData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [feedBack, setFeedBack] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [showFeedback, setShowFeedback] = React.useState(true);
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [prescriptionList, setPrescriptionList] = React.useState([]);
  const [imgList, setImgList] = React.useState([]);
  const [prescriptionData, setPrescriptionData] = React.useState([]);
  const [status, setStatus] = React.useState('');
  const [currentAge, setCurrentAge] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);


  const fetchDocProfile = async () => {
    // let res = await getData(`doctor/profile/${docId}`);
    // console.log('doc profile', JSON.stringify(res));
    // if (res.success) {
    //   setAppointmentData(res.data);
    // }
     console.log('appointment', appointment);
    setTimeout(() => {
      setAppointmentData(appointment);
      getAge(appointment?.age)
      if(appointment.status === 0){
        setStatus('Pending')
      }
      if(appointment.status === 2){
        setStatus('Done')
      }
      if(appointment.status === 3){
        setStatus('Absent')
      }
      setLoading(false);
    }, 100);
  };

  const getAge = (dateString) => {
    var dates = dateString.split("/");
    var d = new Date();

    var userday = dates[0];
    var usermonth = dates[1];
    var useryear = dates[2];

    var curday = d.getDate();
    var curmonth = d.getMonth()+1;
    var curyear = d.getFullYear();

    var age = curyear - useryear;

    if((curmonth < usermonth) || ( (curmonth == usermonth) && curday < userday )){

        age--;

    }
    console.log('age1=',age);
    return setCurrentAge(age);
}

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 2048,
      compressImageMaxHeight: 1024,
      cropping: true,
      compressImageQuality: 1,
      includeBase64: true,
      multiple: true,
    }).then(image => {
      setPrescriptions(prev => [...prev, image]);
     
    //  setShowFeedback(true)
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 2048,
      height: 1024,
      cropping: true,
      compressImageQuality: 0.7,
      includeBase64: true,
      multiple: true,
    }).then(image => {
      // let images = image.map(item => item?.path);
      setPrescriptions(prev => [...prev, image].flat());
     
     // setShowFeedback(true)
    });
  };

  const addPrescription = () => {
    Alert.alert(
      'Add Prescription',
      'Upload prescription from',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel'),
          style: 'cancel',
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
      {cancelable: true},
    );
  };

  const sendPerscription = async () => {
    // console.log('dt==',appointment?.patient_id,appointment?.doctor_id,feedBack,prescriptions)
    setSendLoading(true);
    var body = {
      patient_id: appointment?.patient_id,
      doctor_id: appointment?.doctor_id,
      description: feedBack,
      prescription: prescriptions.map(item => item?.data),
      create_date:appointment?.create_date
    };
    const result = await postData('doctor_send_prescrition_patient', body);
     console.log('body-->', body);
    if (result.success) {
      successToast('Feedback Send SuccessFullly');
      setShowModal(true)
      // navigation.navigate('Home1');
    // navigation.goBack();
    } else {
      errorToast('Something Went Wrong Please Check');
    }
    setSendLoading(false);
  
     setPrescriptions([])
     getFeedbackList();
  };

  const getFeedbackList = async () => {
   // setLoading(true);
    let res = await getData(
      `doctorfeedback/${appointment?.doctor_id}/${appointment?.patient_id}`,
    );

    if (res.success) {
    
     console.log('feedbaclist==',res.data);
      setPrescriptionList(res.data);

    }
   // setLoading(false);
  };

 const deleteFeedback = async (id) => {
console.log('fid==',id);
  setLoading(true);
  let res = await getData(
    `doctorfeedbackdelete/${id}`,
  );
  console.log('res==',res);
  if (res.success) {
  
  successToast('Successfully Delete')

  }
  else{
    errorToast('Something Went wrong please check')
  }
  setLoading(false);
  getFeedbackList();


 }


  useEffect(() => {
    fetchDocProfile();
    getFeedbackList();
    
   
  }, []);

  const onPrimaryPress = () => {
    setPrescriptions([]);
    setShowModal(false);
    getFeedbackList();
    setFeedBack('')
  };

  return (
    <View style={styles.container}>
      <View style={styles.doctorContainer}>
        {loading ? (
          <View>
            <DocProfilePlaceholder />
          </View>
        ) : (
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: appointmentData?.profileimage
                  ? appointmentData.profileimage.length > 20
                    ? `data:image/png;base64,${appointmentData.profileimage}`
                    : appointmentData.profileimage
                  : 'https://www.w3schools.com/w3images/avatar6.png',
              }}
              style={styles.image}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.doctorName}>
                {appointmentData?.patient_name}
              </Text>
              {/* <Text style={styles.doctorSpeciality}>
                {appointmentData?.category}
              </Text> */}
              <View style={styles.ratingContainer}>
                <View style={styles.ratingIconContainer}>
                  {/* <MaterialCommunityIcons
                    name="star"
                    size={20}
                    color={Color.yellow}
                    style={styles.ratingIcon}
                  /> */}
                  <Text>📙</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.ratingText}>Appointment No.</Text>
                  <Text style={styles.ratingStat}>{appointmentData?.token_no}</Text>
                </View>
              </View>
              <View style={{...styles.ratingContainer, marginTop: 10}}>
                <View style={styles.ratingIconContainer}>
                  <MaterialIcons
                    name="payments"
                    size={20}
                    color={Color.green}
                    style={styles.ratingIcon}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.ratingText}>Fees</Text>
                  <Text style={styles.ratingStat}>₹ 500</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: Dimension.window.height * 0.5,
          }}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 30,
            padding: 10,

          }} showsVerticalScrollIndicator={false}>
          {/* <View style={{...styles.card, backgroundColor: Color.white}}>
          <Text style={{...styles.cardTitle}}>Biography</Text>
          <View style={styles.cardContent}>
            <Text style={{...styles.cardText}}>
              He is heart specialist with 5 yrs of experience.
            </Text>
          </View>
        </View> */}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                ...styles.card,
                backgroundColor: Color.white,
                flex: 1,
              }}>
              <Text style={{...styles.cardTitle}}>Date Time</Text>
              <View style={styles.cardContent}>
                <Text style={{...styles.cardText}}>
                  {appointmentData?.created_at?.toString().split('T')[0]}
                </Text>
              </View>
              <View>
                <Text style={{...styles.cardText}}>
                  {new Date(appointmentData?.created_at).toLocaleTimeString()}
                </Text>
              </View>
            </View>
            <View
              style={{
                ...styles.card,
                backgroundColor: Color.white,
                flex: 1,
              }}>
              <Text style={{...styles.cardTitle}}>Status</Text>
              <View style={styles.cardContent}>
                <Text style={{...styles.cardText}}>{status}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                ...styles.card,
                backgroundColor: Color.white,
                flex: 1,
              }}>
              <Text style={{...styles.cardTitle}}>Payment Type</Text>
              <View style={styles.cardContent}>
                <Text style={{...styles.cardText}}>
                {appointmentData.payment_status == '1' && appointmentData.consulation_charge !== '0'
            ? 'Paid'
            : appointmentData.payment_status == '1' && appointmentData.consulation_charge == '0'
            ? 'Free'
            : 'Pending'}
                </Text>
              </View>
             
            </View>
            <View
              style={{
                ...styles.card,
                backgroundColor: Color.white,
                flex: 1,
              }}>
              <Text style={{...styles.cardTitle}}>Amount Paid</Text>
              <View style={styles.cardContent}>
                <Text style={{...styles.cardText}}>{appointmentData?.consulation_charge !== null ? appointmentData?.consulation_charge : 'Pending'}</Text>
              </View>
            </View>
          </View>
          <View style={{...styles.card, backgroundColor: Color.white}}>
            <Text style={{...styles.cardTitle}}>Patient Problem</Text>
            <View style={styles.cardContent}>
              <Text style={{...styles.cardText}}>
                {appointmentData?.category}
              </Text>
            </View>
          </View>
          <View style={{...styles.card, backgroundColor: Color.white}}>
            <Text style={{...styles.cardTitle}}>Patient Weight</Text>
            <View style={styles.cardContent}>
              <Text style={{...styles.cardText}}>
                {appointmentData?.weight} {appointmentData?.weighttype}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                ...styles.card,
                backgroundColor: Color.white,
                flex: 1,
              }}>
              <Text style={{...styles.cardTitle}}>Age</Text>
              <View style={styles.cardContent}>
                <Text style={{...styles.cardText}}>
                  {currentAge} Years
                </Text>
              </View>
            </View>
            <View
              style={{
                ...styles.card,
                backgroundColor: Color.white,
                flex: 1,
              }}>
              <Text style={{...styles.cardTitle}}>Sex</Text>
              <View style={styles.cardContent}>
                <Text style={{...styles.cardText}}>
                  {appointmentData?.gender.charAt(0).toUpperCase() +
                    appointmentData?.gender.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{...styles.card, backgroundColor: Color.white}}>
            <Text style={{...styles.cardTitle}}>Send Feedback</Text>
            <View>
              <TextInput
                placeholder="Enter your feedback"
                placeholderTextColor={Color.grey}
                color={'#000'}
                style={{
                  textAlignVertical: 'top',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  fontFamily: 'Poppins-Regular',
                }}
                value={feedBack}
                onChangeText={setFeedBack}
                multiline={true}
                numberOfLines={3}
               // ref={input => {TextInput=input}}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', paddingHorizontal: 5}}>
            <Button
              mode="contained"
              onPress={addPrescription}
              icon="plus"
              uppercase={false}
              color={Color.white}
              labelStyle={{
                color: Color.black,
                fontFamily: Fonts.primaryRegular,
                lineHeight: 14 * 1.4,
                letterSpacing: 0,
              }}
              contentStyle={{
                paddingVertical: 5,
              }}
              style={{
                marginTop: 10,
                flex: 1,
                borderRadius: 10,
              }}>
              Add prescription
            </Button>
            <Button
              mode="contained"
              loading={sendLoading}
              icon="send"
              onPress={sendPerscription}
              uppercase={false}
              color={Color.white}
              labelStyle={{
                color: Color.black,
                fontFamily: Fonts.primaryRegular,
                lineHeight: 14 * 1.4,
                letterSpacing: 0,
              }}
              contentStyle={{
                paddingVertical: 5,
              }}
              style={{
                marginTop: 10,
                marginLeft: 10,
                flex: 1,
                borderRadius: 10,
              }}>
              Send
            </Button>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              flexWrap: 'wrap',
            }}>
          

            <FlatList
              data={prescriptions}
              
              nestedScrollEnabled={true}
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <>
                    <Image
                      source={{uri: item?.path}}
                      style={{
                        flex: 0.5,
                       // height: 150,
                        minHeight:190,
                        margin: 5,
                        marginTop: 15,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#ccc',
                      }}
                      resizeMode='center'
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setPrescriptions(
                          prescriptions.filter((item, i) => i !== index),
                        );
                      }}
                      style={{
                        // position: 'absolute',
                        margin: 5,
                        marginTop: 15,
                        // top: index % 3 == 0 ? index * 130 : (index - 1) * 130,
                        // right: Dimension.window.width * 0.3 * index,
                        zIndex: 999,
                      }}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        color={Color.black}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
            />
    
          </View>

          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.primaryBold,
              color: Color.black,
              marginTop: 20,
            }}>
            Feedback List
          </Text>

          {prescriptionList.map((item, index) => {
            return (
              <FeedbackCard 
               onEdit={ () =>navigation.navigate('FeedbackDetails',{
                desc:item.description != null ? item.description : 'Perscription',
                date: new Date(item.date).toDateString().slice(3),
                img:item.prescription,
              })}
              date={new Date(item.date).toDateString().slice(3)}
              source={{uri: `data:image/png;base64,${item?.prescription[0]}`}}
              description={item.description != null ? item.description : 'Perscription' }
              onDelete={ () => deleteFeedback(item.id)}
              />
            );
          })}
        </ScrollView>
       )} 
      {/* <View style={styles.bottom}>
        {new Date(appointmentData.date) >= new Date().setHours(0, 0, 0, 0) &&
        !appointmentData?.status ? (
          <>
            <Button
              mode="contained"
              onPress={() => {}}
              color={Color.red}
              style={{
                flex: 1,
                borderRadius: 0,
              }}
              contentStyle={{
                height: 55,
              }}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              color={Color.green}
              style={{
                flex: 1,
                borderRadius: 0,
              }}
              contentStyle={{
                height: 55,
              }}>
              Confirm
            </Button>
          </>
        ) : appointmentData?.status == -1 ? (
          <Button
            mode="contained"
            onPress={() => {}}
            icon={({size, color}) => (
              <MaterialCommunityIcons name="close" size={24} style={{color}} />
            )}
            color={Color.red}
            style={{
              flex: 1,
              borderRadius: 0,
            }}
            contentStyle={{
              height: 55,
            }}>
            Cancelled
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => {}}
            icon={({size, color}) => (
              <MaterialCommunityIcons name="check" size={24} style={{color}} />
            )}
            color={Color.green}
            style={{
              flex: 1,
              borderRadius: 0,
            }}
            contentStyle={{
              height: 55,
            }}>
            Confirmed
          </Button>
        )}
      </View> */}
      <SuccessModal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        title="Prescriptions Sent Successfully"
        primaryBtnText="Add More"
       onPrimaryPress={() => onPrimaryPress()}
        secondaryBtnText="Go Back"
        onSecondaryPress={() => {
          setShowModal(false);
          getFeedbackList();
         navigation.goBack();
         
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  doctorContainer: {
    // height: '40%',
    width: '100%',
    paddingVertical: 20,
    borderBottomLeftRadius: 25,
    alignItems: 'center',
    // justifyContent: 'center',
    borderBottomRightRadius: 25,
    backgroundColor: Color.white,
    elevation: 10,
  },
  icon: {
    width: '100%',
    padding: 20,
  },
  image: {
    height: 180,
    width: 120,
    borderRadius: 20,
    marginRight: 25,
  },
  profileContainer: {
    flexDirection: 'row',
    width: '90%',
    // alignItems: 'center',
    // justifyContent: 'space-around',
  },
  profileDetails: {
    paddingVertical: 5,
    flexDirection: 'column',
  },
  doctorName: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: Color.black,
  },
  doctorSpeciality: {
    color: Color.grey,
    fontFamily: 'Poppins-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  ratingIconContainer: {
    elevation: 6,
    shadowColor: Color.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: Color.white,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 15,
  },
  ratingText: {
    fontFamily: 'Poppins-Regular',
    color: Color.grey,
    fontSize: 12,
    lineHeight: 14 * 1.5,
  },
  ratingStat: {
    fontFamily: 'Poppins-Bold',
    lineHeight: 14 * 1.5,
    color: Color.black,
  },
  card: {
    flexDirection: 'column',
    marginTop: 10,
    marginHorizontal: 5,
    backgroundColor: Color.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#00000050',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: Color.black,
    fontFamily: 'Poppins-Regular',
  },
  cardContent: {
    flexDirection: 'column',
    paddingTop: 10,
  },
  cardText: {
    fontSize: 16,
    color: Color.black,
    fontFamily: 'Poppins-Medium',
  },
  bottom: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 8,
    shadowColor: Color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  listItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
   // padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 8,
    shadowColor: Color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
    marginTop:10
  },
  listImage: {
    // height: 75,
    // width: 75,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginRight: 15,
    flex:1
  },
  listItemText: {
    justifyContent: 'space-evenly',
    flex: 1,
    padding:10
  },
  listItemTitle: {
    fontSize: 16,
    color: Color.black,
    // fontWeight: '700',
    fontFamily: Fonts.primaryRegular,
    width:'80%',
    textAlign:'center'
  },
  listItemSubTitle: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.primaryRegular,
    color: '#999',
  },
});
