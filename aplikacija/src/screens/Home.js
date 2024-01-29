import {StyleSheet, Text, View, Image, StatusBar} from "react-native";
import React from "react";
import Menu from "../component/Menu";


const Home = (props) => {

  const description =
    "Ovo je mobilna aplikacija sajta za kreiranje događaja";

  return (
    <View style={styles.mainContainer}>
      <View style={styles.homeTop}>
        <Image
          style={styles.headerImage}
          resizeMode="stretch"
          source={require("../../assets/logo.jpeg")}
        />

        <Text style={styles.mainHeader}>Dobrodošli na početnu stranicu</Text>
        <Text style={styles.paraStyle}>{description} </Text>
        <Text
          style={[
            styles.mainHeader,
            {
              fontSize: 33,
              color: "#4c5dab",
              marginTop: 0,
            },
          ]}>
          {props.channelName}
        </Text>
        
        
      </View>

      <View style={styles.menuStyle}>
        <View style={styles.lineStyle}></View>
        <Menu />
        <View
          style={[
            styles.lineStyle,
            {
              marginVertical: 10,
            },
          ]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    textAlign: "center",
  },

  homeTop: {
    // height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  headerImage: {
    height: undefined,
    width: "100%",
    aspectRatio: 1,
    display: "flex",
    alignItems: "stretch",
    marginTop: 50,
    borderRadius: 20,
  },

  mainHeader: {
    fontSize: 30,
    textAlign: "center",
    color: "#344055",
    textTransform: "uppercase",
  },

  paraStyle: {
    textAlign: "center",
    fontSize: 18,
    color: "#7d7d7d",
    marginTop: 30,
    paddingBottom: 50,
    lineHeight: 27,
  },

  lineStyle: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "grey",
  },
});

export default Home;
