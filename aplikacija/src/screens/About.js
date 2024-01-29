import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";

export default function About() {

  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.mainHeader}></Text>

      <View>
        <Image
          style={styles.imgStyle}
          source={
            require("../../icons/icons8-info-100.png")
          }
        />
      </View>

      <View style={styles.aboutLayout}>
        <Text style={styles.aboutSubHeader}> O aplikaciji </Text>
        <Text style={[styles.paraStyle, styles.aboutPara]}>
          Aplikacija se nadovezuje na sajt. Nakon logovanje korisnik ima mogućnost da kreira događaje, doda poklone i pozove prijatelje na svoj događaj
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    display: "flex",
    alignItems: "center",
  },

  imgStyle: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  mainHeader: {
    fontSize: 18,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "500",
    // marginTop: 50,
    marginTop: 40,
    marginBottom: 10
  },
  paraStyle: {
    fontSize: 18,
    color: "#7d7d7d",
    paddingBottom: 30
  },
  aboutLayout: {
    backgroundColor: "#4c5dab",
    paddingHorizontal: 30,
    // marginVertical: 30,
    marginTop: 20,
  },
  aboutSubHeader: {
    fontSize: 18,
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "500",
    marginVertical: 15,
    alignSelf: "center",
  },
  aboutPara: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 26,
  },
  menuContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  iconStyle: {
    width: "100%",
    height: 50,
    aspectRatio: 1,
  },
});

// export default About;
