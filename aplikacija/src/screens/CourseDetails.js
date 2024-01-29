import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Linking} from "react-native";
import React from "react";
import Courses from "../api/Courseapi";

const CourseDetails = ({ navigation, route }) => {

  const id = route.params.eventId;
  const eventName =route.params.eventName;
  const eventDescription =route.params.eventDescription;
  const eventLocation =route.params.eventLocation;
  const eventFoto =route.params.eventFoto;
  const created_by = route.params.created_by;


  /*const selectedCourse = Courses.find((element) => {
    return id === element.id;
  });*/

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.courseContainer}>
        <View>
          <Image
            style={styles.cardImage}
            source={{uri:"https://first.stud.vts.su.ac.rs/nwp/images/events/"+eventFoto,}}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.mainHeader}>{eventName}</Text>

        <Text style={styles.description}>{eventDescription}</Text>

        <Text style={[styles.description, styles.subCourse]}>
          Lokacija: {eventLocation}
        </Text>

        {/*<Text style={[styles.description, styles.subCourse]}>
          {selectedCourse.course2}
        </Text>

        <Text style={[styles.description, styles.subCourse]}>
          {selectedCourse.course3}
        </Text>*/}

        <View style={styles.buttonContainer}>
          <View style={styles.imageContainer}>
          <Image
              style={styles.image}
              source={require("../../icons/mail-outline.png")}
              resizeMode={"contain"}
          />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL("mailto:"+created_by)/*navigation.navigate("EmailRequest",{eventId:id})*/}>
            <Text style={styles.buttonText}> Pošaljite zahtev organizatoru </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// !todo style the course1 and make it uppercase

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "red",
    paddingHorizontal: 20,
  },
  courseContainer: {
    // height: "50%",
    // display: "flex",
    padding: 0,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    textAlign: "center",
    borderRadius: 5,
    marginVertical: 30,
  },

  cardImage: {
    width: "100%",
    display: "flex",
    alignSelf: "center",
    height: undefined,
    aspectRatio: 1,
  },

  mainHeader: {
    fontSize: 22,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "500",
    paddingTop: 10,
    paddingBottom: 0,
    textAlign: "center",
  },

  subHeader: {
    fontSize: 18,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "500",
    paddingBottom: 15,
    textAlign: "center",
  },

  description: {
    padding:10,
    textAlign: "left",
    fontSize: 16,
    color: "#7d7d7d",
    paddingBottom: 10,
    lineHeight: 20,
  },
  subCourse: {
    textAlign:"center",
    textTransform: "uppercase",
    color: "#344055",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    borderTopWidth: 1,
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderColor: "#809fff", // You can change the color here
    borderBottomLeftRadius: 5,
    padding: 0, // Adjust as needed
    maxWidth:"30%",
    flex: 3,
  },
  image: {
    flex: 1,
    width: null, // Adjust as needed
    height: null, // Adjust as needed
  },
  button: {
    backgroundColor: "#809fff", // Button fill color
    borderBottomRightRadius: 5, // Adjust as needed to match image
    paddingVertical: 10, // Adjust as needed
    paddingHorizontal: 20, // Adjust as needed
    flex:7,
    marginLeft: 0, // Adjust spacing between image and button
  },
  price: {
    width: "15%",
    height:"100%",
    resizeMode:"center",
    backgroundColor: "#eeeeee",
    paddingVertical: 0,
    paddingHorizontal: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  buttonStyle: {
    backgroundColor: "#809fff",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    color: "#eee",
    textAlign: "center",
  },
});

export default CourseDetails;
