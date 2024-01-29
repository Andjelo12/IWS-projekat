//forget
import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//

const SendRequest = ({navigation,route}) => {
    const id = route.params.eventId;
    const [email, setEmail] = useState('');
    const [message, setMessage]=useState('');
    const [name, setName]=useState('');

    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [nameErrorMessage, setNameErrorMessage]=useState('');
    const [messageErrorMessage, setMessageErrorMessage]=useState('');
    //


    const sendEmail = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        setEmailErrorMessage("");
        setMessageErrorMessage("");
        setNameErrorMessage("");
        if (email === "") {
            setEmailErrorMessage("Unesite e-mail adresu!");
        } else if (reg.test(email) === false) {
            setEmailErrorMessage("Email je u lošem formatu!");
        }
        if (message === "") {
            setMessageErrorMessage("Unesite poruku!");
        }
        if (name === "") {
            setNameErrorMessage("Unesite poruku!");
        }
        if (email !== "" && reg.test(email) !== false && name !== "" && message !== "") {
            try {
                const response = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/events/eventRequests/'+id, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        // we will pass our input data to server
                        inviteEmail: email,
                        inviteName: name,
                        message : message
                    })
                });

                const responseJson = await response.json();

                if (responseJson.status === 200) {
                    // redirect to profile page
                    Alert.alert("Obaveštenje", "Poruka uspešno poslata.");
                    navigation.goBack();
                } else if (responseJson.status===409){
                    Alert.alert("Obaveštenje", "Dodati ste u listu zvanica.");
                    navigation.goBack();
                } else if (responseJson.status === 406){
                    Alert.alert("Greška", "Zahtev je već poslat!");
                    navigation.goBack();
                }
            } catch (error) {
                console.error(error);
            }
        }

    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.formBottomContainer}>
                    <View style={styles.formBottomSubContainer}>
                        <View style={styles.customInputContainer}>
                            <TextInput
                                placeholder='Unesite vašu e-mail adresu'
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setEmail(text);
                                    setEmailErrorMessage("");
                                }}
                                autoCapitalize="none"
                            />
                        </View>
                        {emailErrorMessage !== "" && <Text style={{color: 'red'}}>{emailErrorMessage}</Text>}
                        <View style={styles.customInputContainer}>
                            <TextInput
                                placeholder='Unesite vaše ime'
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setName(text);
                                    setNameErrorMessage("");
                                }}
                            />
                        </View>
                        {nameErrorMessage !== "" && <Text style={{color: 'red'}}>{nameErrorMessage}</Text>}
                        <View style={styles.customInputContainer}>
                            <TextInput
                                placeholder='Unesite poruku'
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setMessage(text);
                                    setMessageErrorMessage("");
                                }}
                                multiline={true}
                            />
                        </View>
                        {messageErrorMessage !== "" && <Text style={{color: 'red'}}>{messageErrorMessage}</Text>}
                        {/*  */}
                        {/*  */}
                        {/*  */}
                        {/*  */}
                        <TouchableOpacity
                            style={styles.forgetButton}
                            onPress={() => {
                                sendEmail();
                            }}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                                pošalji poruku
                            </Text>
                        </TouchableOpacity>
                        {/*  */}
                        {/*  */}
                        {/*  */}
                        {/*  */}

                        {/*  */}
                        {/*  */}
                        {/*  */}
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
        padding: 10,
    },
    customInputContainer: {
        marginTop: 3,
        borderWidth: 2,
        borderColor: '#02C38E',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    forgetButton: {
        backgroundColor: '#02C38E',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 10,
    },
});

export default SendRequest;