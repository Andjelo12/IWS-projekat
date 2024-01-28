import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Courses from "../api/Courseapi";
import {useIsFocused} from '@react-navigation/native';
import { ActivityIndicator } from "react-native";
import NetInfo from '@react-native-community/netinfo';

const Course = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [events, setEvents] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if(isFocused && isConnected)
      fetchData();
  }, [isFocused,isConnected]);

  const fetchData = async () => {
    try {
      const response = await fetch(
          'https://first.stud.vts.su.ac.rs/nwp/api/events/',
          {
            method: 'GET',
            headers: {
              'Accept' : 'application/json'
            },
          }
      );

      const result = await response.json();

      if (result.status === 200) {
        setEvents(result.data);
      }
      setLoading(false);

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const courseCard = ({ item }) => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.courseContainer}>
          <View>
            <Image
              style={styles.cardImage}
              source={{uri : "https://first.stud.vts.su.ac.rs/nwp/images/events/"+item.foto,}}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.mainHeader}>{item.name}</Text>

          <Text style={styles.description}>Datum održavanja: {'\n'}{item.date}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() =>
                navigation.navigate("CourseDetails", {
                  eventId: item.id,
                  eventName: item.name,
                  eventDescription: item.description,
                  eventLocation: item.location,
                  eventFoto: item.foto,
                  created_by: item.created_by,
                })
              }>
              <Text style={styles.buttonText}> Detaljnije </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!isConnected) {
    return (
        <View style={styles.containerInfo}>
          <Image
              source={require('../../icons/icons8-wi-fi-disconnected-100.png')} // Replace with the actual path to your loading image
              style={styles.loadingImage}
              resizeMode="contain"
          />
          <Text style={styles.bottomText}>Povežite se sa internetom</Text>
        </View>
    );
  }

  return (
    isLoading === false ? ( 
      events.length>0 ? (
      <FlatList
      keyExtractor={(item) => item.id.toString()}
      data={events}
      renderItem={courseCard}
      />): (<View style={styles.container}>
        <Image
          source={require('../../icons/icons8-empty-100.png')} // Replace with the actual path to your loading image
          style={styles.loadingImage}
          resizeMode="contain"
        />
        <Text style={styles.bottomText}>Nema događaja</Text>
      </View>)) : (
        <View style={styles.container}>
          <ActivityIndicator animating={true} size="large" style={{opacity: 1}} color="#00f"/>
        </View>
      )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInfo: {
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
    paddingHorizontal: 20,
  },
  courseContainer: {
    paddingTop: 0,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    textAlign: "center",
    borderRadius: 5,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    marginVertical: 30,
  },
  mainHeader: {
    fontSize: 22,
    color: "#344055",
    textTransform: "uppercase",
    // fontWeight: 500,
    paddingBottom: 15,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    paddingBottom: 15,
    lineHeight: 20,
    fontSize: 16,
    color: "#7d7d7d",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonStyle: {
    backgroundColor: "#809fff",
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
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
});

export default Course;
