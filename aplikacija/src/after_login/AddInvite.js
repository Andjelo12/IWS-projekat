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

const AddInvite = ({navigation,route}) => {
    const id = route.params.eventId;
    const [email, setEmail] = useState('');
    const [name, setName]=useState('');

    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [nameErrorMessage, setNameErrorMessage]=useState('');
    const [isChecked, setIsChecked] = useState(false);
    //


    const sendData = async () => {
        setEmailErrorMessage("");
        setNameErrorMessage("");
        if (name === "") {
            setNameErrorMessage("Unesite ime zvanice!");
        }
        if (email === "") {
            setEmailErrorMessage("Unesite email zvanice!");
        }
        if (name !== "" && email !== "") {
            try {
                const response = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/presentsInvites/invites/'+id, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        inviteEmail: email,
                        inviteName: name,
                    })
                });

                const responseJson = await response.json();

                if (responseJson.status === 200) {
                    // redirect to profile page
                    Alert.alert("Obaveštenje", "Zvanica uspešno dodata!");
                    navigation.goBack();
                } else if (responseJson.status===400){
                    setEmailErrorMessage("Email nije validan!");
                } else if (responseJson.status===409){
                    setEmailErrorMessage("Email je već dodat u listu zvanica!");
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
                            <Text>Ime zvanice</Text>
                            <TextInput
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setName(text);
                                    setNameErrorMessage("");
                                }}
                            />
                        </View>
                        {nameErrorMessage !== "" && <Text style={{color: 'red'}}>{nameErrorMessage}</Text>}
                        <View style={styles.customInputContainer}>
                            <Text>Email zvanice</Text>
                            <TextInput
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setEmail(text);
                                    setEmailErrorMessage("");
                                }}
                                autoCapitalize="none"
                                keyboardType={"email-address"}
                            />
                        </View>
                        {emailErrorMessage !== "" && <Text style={{color: 'red'}}>{emailErrorMessage}</Text>}
                        {/*<View style={styles.checkboxContainer}>*/}
                        {/*    <TouchableOpacity*/}
                        {/*        style={[styles.checkbox, isChecked ? styles.checked : styles.unchecked]}*/}
                        {/*        onPress={() => setIsChecked(!isChecked)}*/}
                        {/*    />*/}
                        {/*    <Text style={{marginLeft: 8}}>Dodaj poklone</Text>*/}
                        {/*</View>*/}
                        <TouchableOpacity
                            style={styles.forgetButton}
                            onPress={() => {
                                sendData();
                            }}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                                dodaj zvanicu
                            </Text>
                        </TouchableOpacity>
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
    },
    checked: {
        backgroundColor: '#02C38E',
        borderColor: '#02C38E',
    },
    unchecked: {
        backgroundColor: '#fff',
        borderColor: '#02C38E',
    },
});

export default AddInvite;