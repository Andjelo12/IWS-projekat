import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    Touchable,
    TouchableOpacity,
    Modal,
    Button,
    StatusBar,
    Alert, Linking
} from "react-native";
import React, { useEffect, useState } from "react";
import {useIsFocused} from '@react-navigation/native';
import { ActivityIndicator } from "react-native";

const Presents = ({ navigation,route }) => {
    const id = route.params.eventId;
    const isFocused = useIsFocused();
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if(isFocused) {
            fetchData();
        }
    }, [isFocused]);


    const fetchData = async () => {
        try {
            const response = await fetch(
                'https://first.stud.vts.su.ac.rs/nwp/api/presentsInvites/wish_list/'+id,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const result = await response.json();

            if (result.status === 200) {
                setEvents(result.data);
                // await fetchData();
            } else if (result.status === 404){
                setEvents([]);
            }
            setLoading(false);
            /*else {
              console.log(result.status, result.message);
              Alert.alert('Error', 'Failed to update data.');
            }*/
        } catch (error) {
            console.error('Error updating data:', error);
            Alert.alert('Error', 'Failed to update data.');
        }
    };

    const handleDeleteConfirmation = (item) => {
        setSelectedEvent(item);
        setModalVisible(true);
    };

    const handleDelete = () => {
        // Logic to delete the selected item
        deleteData(selectedEvent.id);
        // Here you can make a request to delete the selected event
        setModalVisible(false);
    };

    const deleteData = async (id) => {
        try {
            const response = await fetch(
                'https://first.stud.vts.su.ac.rs/nwp/api/presentsInvites/wish_list/'+id,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    },
                }
            );

            const result = await response.json();

            if (result.status === 200) {
                Alert.alert("Obaveštenje","Poklon uspešno obrisan");
                fetchData();
            }
            /*else {
              console.log(result.status, result.message);
              Alert.alert('Error', 'Failed to update data.');
            }*/
        } catch (error) {
            console.error('Error updating data:', error);
            Alert.alert('Error', 'Failed to update data.');
        }
    }

    const handleLinkPress = (link) => {
        Linking.openURL(link);
    };
    const courseCard = ({ item }) => {

        return (
            <View style={styles.mainContainer}>
                <View style={styles.courseContainer}>
                    <Text style={styles.mainHeader}>{item.item}</Text>
                    <TouchableOpacity onPress={()=> handleLinkPress(item.link)}>
                        <Text style={styles.description}>link poklona</Text>
                    </TouchableOpacity>
                    {/*{item.user_buying_present && <Text style={styles.buyer}>Kupuje ga: {item.user_buying_present}</Text>}*/}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.roundedButton, styles.redButton]}
                            onPress={() => {
                                handleDeleteConfirmation(item);
                            }}>
                            <Image
                                source={require("../../icons/trash-outline.png")}
                                style={styles.symbolButtons}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            {isLoading === false ? (
                events.length>0 ? (
                    <FlatList
                        keyExtractor={(item) => item.id.toString()}
                        data={events}
                        renderItem={courseCard}
                    />): (<View style={styles.container}>
                    <Image
                        source={require('../../icons/icons8-gift-100.png')}
                        style={styles.loadingImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.bottomText}>Dodaj poklone</Text>
                </View>)) : (
                <View style={styles.container}>
                    <ActivityIndicator animating={true} size="large" style={{opacity: 1}} color="#00f"/>
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    style={styles.modalOverlay} // Style for covering the entire screen
                    activeOpacity={1} // Make it non-interactive
                    onPress={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Potvrdite brisanje</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.roundedButton, styles.whiteButton]}
                                    onPress={handleDelete}>
                                    <Image
                                        source={require("../../icons/checkmark-circle-outline.png")}
                                        style={styles.symbolButtons}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roundedButton, styles.redButton]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Image
                                        source={require("../../icons/close-circle-outline.png")}
                                        style={styles.symbolButtons}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity
                style={styles.fixedIcon}
                onPress={() => {
                    // Handle the press event for the fixed icon
                    navigation.navigate('AddPresent',{eventId:id});
                }}
            >
                <Image
                    source={require("../../icons/add-circle-outline.png")}
                    style={{ width: 55, height: 55, }}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingImage: {
        width: 100, // Adjust the width and height based on your image size
        height: 100,
    },
    bottomText: {
        marginTop: 10, // Adjust the margin based on your design
        fontSize: 16,
        color: 'black', // Adjust the color based on your design
    },
    cardImage: {
        width: "100%",
        height: undefined,
        aspectRatio: 1,
    },
    mainContainer: {
        paddingHorizontal: 10,
        marginBottom:0,
        marginTop: 10
    },
    courseContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.90)",
        textAlign: "center",
        borderRadius: 5,
        shadowColor: "white",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
        marginVertical: 0,
        width:"100%",
        alignSelf:"stretch"
    },
    mainHeader: {
        fontSize: 22,
        color: "#344055",
        textTransform: "uppercase",
        // fontWeight: 500,
        paddingBottom: 7,
        paddingHorizontal:15,
        textAlign: "center",
    },
    description: {
        textAlign: "center",
        paddingBottom: 10,
        paddingHorizontal: 15,
        lineHeight: 20,
        fontSize: 16,
        color: "blue",
        textDecorationLine:"underline",
    },
    buyer: {
        textAlign: "center",
        paddingBottom: 20,
        paddingHorizontal: 15,
        lineHeight: 20,
        fontSize: 16,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonStyle: {
        backgroundColor: "#809fff",
        borderRadius: 5,
        paddingVertical: 10,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
        color: "#eee",
        textTransform: "capitalize",
    },
    fixedIcon: {
        position: "absolute",
        bottom: 16,
        right: 16,
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 5,
        elevation: 5,
    },
    roundedButton: {
        borderRadius: 50, // Adjust border radius as needed
        paddingVertical: 7,
        paddingHorizontal: 7,
        marginHorizontal: 7,
        marginBottom: 10,
        elevation: 5,
    },
    whiteButton:{
        backgroundColor: "#fff",
    },
    greenButton: {
        backgroundColor: "#84ecb7",
    },
    violetButton: {
        backgroundColor: "#809fff",
    },
    redButton: {
        backgroundColor: "#ec1382",
    },
    symbolButtons:{
        width: 40,
        height: 40,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    },
    modalOverlay: {
        flex: 1,
        // Semi-transparent background color
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Presents;
