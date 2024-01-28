import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Alert, Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwsome from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';

//

export default function AddEvent({route}) {
    const [date, setDate] = useState('');
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [extension, setExtension]=useState('');

    const [eventNameError, setEventNameError] = useState('');
    const [imageError, setImageError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [dateError, setDateError] = useState('');
    //
    const navigation = useNavigation();
    const onChangeDate = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDate(false);
        } else {
            const currentDate = selectedDate || date;
            setShowDate(false);
            setDate(currentDate);
            setShowTime(true);
        }
    };

    const onChangeTime = (event, selectedTime) => {
        if (event.type === 'dismissed') {
            setShowDate(false);
            setShowTime(false);
        }else {
            const currentDate = selectedTime || date;
            setShowTime(false);
            setDate(currentDate);
            setDateError("");
        }
    };

    const showDatePicker = () => {
        setShowDate(true);
    };

    const formatSQLDateTime = (date) => {
        const year = date.getFullYear();
        const month = padNumber(date.getMonth() + 1);
        const day = padNumber(date.getDate());
        const hours = padNumber(date.getHours());
        const minutes = padNumber(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const formatUserDateTime = (date) => {
        const year = date.getFullYear();
        const month = padNumber(date.getMonth() + 1);
        const day = padNumber(date.getDate());
        const hours = padNumber(date.getHours());
        const minutes = padNumber(date.getMinutes());

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const padNumber = (num) => {
        return num < 10 ? '0' + num : num;
    };

    const addImage= async ()=>{
        let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            /*aspect: [4,3],*/
            quality: 1,
        });
        const test=_image.assets[0].uri.split('.');
        if (!_image.canceled) {
            setImageError('');
            setImage(_image.assets[0].uri);
            setExtension(test[test.length-1]);
        }
    };

    const sendData = async () => {
        setEventNameError('');
        setDescriptionError('');
        setLocationError('');
        setDateError('');
        setImageError('');
        if (eventName === "") {
            setEventNameError("Unesite ime događaja!");
        }
        if (description === "") {
            setDescriptionError("Unesite opis događaja!");
        }
        if (location === "") {
            setLocationError("Unesite lokaciju!");
        }
        if (date === ''){
            setDateError("Izaberite datum!");
        }
        if (image===null){
            setImageError("Ubacite sliku!");
        }
        if (eventName !== "" && description !== "" && location !== "" && date !== "" && image!==null) {
            try {
                const imageName=image.split('/');
                const formData = new FormData();
                formData.append('eventName', eventName);
                formData.append('description', description);
                formData.append('location', location);
                formData.append('date', formatSQLDateTime(date));
                formData.append('created_by',route.params.email);
                formData.append('image', {
                    uri: image,
                    type: "image/jpeg",
                    name: imageName[imageName.length-1], // Modify the name as per your image name
                });
                const response = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/events/',{
                    method:'POST',
                    headers:{
                        'Content-type': 'multipart/form-data',
                    },
                    body:formData,
                });

                const responseJson = await response.json();

                if (responseJson.status === 200) {
                    Alert.alert("Obaveštenje","Događaj uspešno kreiran!");
                    navigation.replace("HomeLogIn",{fetchData: true});
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.formTopContainer}>
                    <View style={styles.formBottomContainer}>
                        <View style={styles.formBottomSubContainer}>
                            <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={addImage}  >
                                <View style={imageUploaderStyles.container}>
                                    {
                                        image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                                    }

                                    {!image && (<View style={{alignItems:"center" }}>
                                        <Image  style={{width:50,height:50}} source={require('../../icons/add.png')} />
                                        <Text>Dodaj sliku</Text>
                                    </View>)}
                                </View>
                            </TouchableOpacity>
                                {imageError !== "" && <Text style={{color: 'red'}}>{imageError}</Text>}
                            </View>
                            <View style={styles.customInputContainer}>
                                <Text>Naziv događaja</Text>
                                <TextInput
                                    style={{padding: 0}}
                                    onChangeText={text => {
                                        setEventName(text);
                                        setEventNameError("");
                                    }}
                                />
                            </View>
                            {eventNameError !== "" && <Text style={{color: 'red'}}>{eventNameError}</Text>}
                            <View style={styles.customInputContainer}>
                                <Text>Opis događaja</Text>
                                <TextInput
                                    multiline={true}
                                    style={{}}
                                    onChangeText={text => {
                                        setDescription(text);
                                        setDescriptionError("");
                                    }}
                                />
                            </View>
                            {descriptionError !== "" && <Text style={{color: 'red'}}>{descriptionError}</Text>}
                            <View style={styles.customInputContainer}>
                                <Text>Lokacija</Text>
                                <TextInput
                                    style={{padding: 0}}
                                    onChangeText={text => {
                                        setLocation(text);
                                        setLocationError("");
                                    }}
                                />
                            </View>
                            {locationError !== "" && <Text style={{color: 'red'}}>{locationError}</Text>}
                            <View style={styles.customInputContainer}>
                                <Text>Datum događaja</Text>
                                <View
                                    style={{flexDirection: 'row', alignContent: 'center', paddingTop:3}}>
                                    <Text
                                        style={{flex:1, color: "gray"}}
                                    >{date !== '' && formatUserDateTime(date).toString()}</Text>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            Keyboard.dismiss();
                                            showDatePicker();
                                        }}>
                                        <FontAwsome
                                            name={'calendar-alt'}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {dateError !== "" && <Text style={{color: 'red'}}>{dateError}</Text>}
                            {showDate && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    mode="date"
                                    value={date || new Date()}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeDate}
                                    minimumDate={new Date()} // Setting minimum date to current date
                                />
                            )}
                            {showTime && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date || new Date()}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeTime}
                                />
                            )}
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => {
                                    sendData();
                                }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                                    kreiraj događaj
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBackgroundImgContainer: {
        flex: 1.5,
        alignItems: 'flex-end',
    },
    backgroundImg: {
        height: '100%',
        width: '80%',
        marginRight: -15,
    },
    bottomBackgroundImgContainer: {
        flex: 1,
    },
    formContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    formTopContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
        marginLeft: 10,
    },
    formBottomContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formBottomSubContainer: {
        width: '95%',
        borderRadius: 10,
        backgroundColor: 'rgba(127,127,127,0.5)',
        padding: 20,
    },
    customInputContainer: {
        marginTop:7,
        borderWidth: 2,
        borderColor: '#02C38E',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    loginButton: {
        backgroundColor: '#02C38E',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 10,
    },
});
const imageUploaderStyles= StyleSheet.create({
    container:{
        elevation:0,
        height:200,
        width:200,
        backgroundColor:'#efefef',
        position:'relative',
        borderRadius:5,
        overflow:'hidden',
        justifyContent:"center",
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'100%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    },
    containerTest: {
        padding:50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

