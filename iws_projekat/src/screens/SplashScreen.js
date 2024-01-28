import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import React from 'react';

//
import Logo from '../../assets/logo.jpeg';

export default function SplashScreen() {
  return (
    <View style={styles.container}>

      <View></View>

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />

        <Text style={styles.text}></Text>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  text: {
    color: '#fff',
  },
  bottomContainer: {},
  bottomText: {
    color: '#fff',
  },
});