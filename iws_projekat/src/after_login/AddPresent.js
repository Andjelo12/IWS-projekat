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

const AddPresent = ({navigation,route}) => {
    const id = route.params.eventId;
    const [link, setLink] = useState('');
    const [name, setName]=useState('');

    const [linkErrorMessage, setLinkErrorMessage] = useState('');
    const [nameErrorMessage, setNameErrorMessage]=useState('');
    //


    const sendData = async () => {
        setLinkErrorMessage("");
        setNameErrorMessage("");
        if (name === "") {
            setNameErrorMessage("Unesite naziv poklona!");
        }
        if (link === "") {
            setLinkErrorMessage("Unesite link poklona!");
        }
        if (link !== "" && name !== "") {
            try {
                const response = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/presentsInvites/wish_list/'+id, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        // we will pass our input data to server
                        link: link,
                        presentName: name,
                    })
                });

                const responseJson = await response.json();

                if (responseJson.status === 200) {
                    // redirect to profile page
                    Alert.alert("Obaveštenje", "Poklon uspešno dodat!");
                    navigation.goBack();
                } else if (responseJson.status===400){
                    setLinkErrorMessage("URL nije validan!");
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
                            <Text>Naziv poklona</Text>
                            <TextInput
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setName(text);
                                    setNameErrorMessage("");
                                }}
                                autoCapitalize="none"
                            />
                        </View>
                        {nameErrorMessage !== "" && <Text style={{color: 'red'}}>{nameErrorMessage}</Text>}
                        <View style={styles.customInputContainer}>
                            <Text>Link poklona</Text>
                            <TextInput
                                placeholder='URL'
                                style={{padding: 0}}
                                onChangeText={text => {
                                    setLink(text);
                                    setLinkErrorMessage("");
                                }}
                                autoCapitalize="none"
                                keyboardType={"url"}
                            />
                        </View>
                        {linkErrorMessage !== "" && <Text style={{color: 'red'}}>{linkErrorMessage}</Text>}
                        <TouchableOpacity
                            style={styles.forgetButton}
                            onPress={() => {
                                sendData();
                            }}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                                dodaj poklon
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
});

export default AddPresent;