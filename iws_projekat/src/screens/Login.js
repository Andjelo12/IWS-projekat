//login
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
import {useEffect} from "react";
import {useNavigation} from '@react-navigation/native';
import FontAwsome from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

//

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  //
  const navigation = useNavigation();


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data: ', error);
    }
  };

  const loginUser = async () => {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if (email === "") {
          setEmailErrorMessage("Unesite e-mail adresu!");
        } else if (reg.test(email) === false) {
          setEmailErrorMessage("Email je u lošem formatu!");
        } else {
          setEmailErrorMessage(""); // Clear the error message if email is valid
        }

		if(password === ""){
          setPasswordErrorMessage("Unesite lozinku!");
		}else{
          setPasswordErrorMessage("");
        }
		if (email !== "" && reg.test(email) !== false && password !== ""){
    fetch('https://first.stud.vts.su.ac.rs/nwp/api/account/login',{
			method:'post',
			headers:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				// we will pass our input data to server
				email: email,
				password: password
			})
			
		})
		.then((response) => response.json())
		 .then((responseJson)=>{
			 if(responseJson.status === 200){
                storeData("email", email);
				 // redirect to profile page
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
                navigation.replace("HomeLogIn");
				 //this.props.navigation.navigate("About");
			 }else if(responseJson.status === 403){
				Alert.alert("Greška","Nalog je blokiran");
			 } else if(responseJson.status === 409){
                Alert.alert("Obaveštenje","Nalog nije aktiviran. Proverite vaš email.");
             } else if(responseJson.status === 401){
                Alert.alert("Greška","Netačni podaci!");
             }
		 })
		 .catch((error)=>{
		 console.error(error);
		 });
    }
  };

  return (
      isConnected ? (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
            {/*  */}
            <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
            Login
          </Text>
            <View style={styles.customInputContainer}>
              <Text>Email</Text>
              <TextInput
                style={{padding: 0}}
                keyboardType={"email-address"}
                onChangeText={text => {
                  setEmail(text);
                  setEmailErrorMessage("");
                }}
                autoCapitalize="none"
              />
            </View>
            {emailErrorMessage !== "" && <Text style={{color: 'red'}}>{emailErrorMessage}</Text>}
            {/*  */}
            {/*  */}
            <View style={styles.customInputContainer}>
              <Text>Password</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1}}
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordErrorMessage("");
                  }}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <FontAwsome
                    name={isPasswordVisible ? 'eye-slash' : 'eye'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {passwordErrorMessage !== "" && <Text style={{color: 'red'}}>{passwordErrorMessage}</Text>}
            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                loginUser();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                Login
              </Text>
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
          
            {/*  */}
            {/*  */}
            <View>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text style={{color: '#fff'}}>Nemate nalog?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Signup');
                  }}>
                  <Text
                    style={{
                      marginLeft: 5,
                      color: '#02C38E',
                      fontWeight: 'bold',
                    }}>
                    Registrujte se
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Forget');
                }}>
                <Text
                  style={{
                    marginLeft: 5,
                    color: '#02C38E',
                    fontWeight: 'bold',
                  }}>
                  Zaboravili ste lozinku ?
                </Text>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </View>
        </View>
    </View>) : (
          <View style={styles.containerInfo}>
            <Image
                source={require('../../icons/icons8-wi-fi-disconnected-100.png')} // Replace with the actual path to your loading image
                style={styles.loadingImage}
                resizeMode="contain"
            />
            <Text style={styles.bottomText}>Povežite se sa internetom</Text>
          </View>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    marginTop: 10, // Adjust the margin based on your design
    fontSize: 16,
    color: 'black', // Adjust the color based on your design
  },
  loadingImage: {
    width: 100, // Adjust the width and height based on your image size
    height: 100,
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
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import React, { useState } from "react";
// import Checkbox from "expo-checkbox";
// import { useFonts, WorkSans_400Regular } from "@expo-google-fonts/work-sans";
// import { Nunito_700Bold } from "@expo-google-fonts/nunito";
// import AppLoading from "expo-app-loading";

// const Contact = ({ navigation }) => {
//   let [fontsLoaded] = useFonts({
//     WorkSans_400Regular,
//     Nunito_700Bold,
//   });

//   if (!fontsLoaded) {
//     <AppLoading />;
//   }

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [agree, setAgree] = useState(false);

//   const submit = () => {
//     if (!name && !email && !phone && !message) {
//       Alert.alert("Plzz fill all the fields");
//     } else {
//       Alert.alert(`Thank You ${name}`);
//       navigation.navigate("Home");
//     }
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <Text style={styles.mainHeader}>Level up your knowledge </Text>

//       <Text style={styles.description}>
//         You can reach us anytime via thapa@vinod.com
//       </Text>

//       <View style={styles.inputContainer}>
//         <Text style={styles.labels}> Enter your name </Text>
//         <TextInput
//           style={styles.inputStyle}
//           placeholder={"vinod thapa"}
//           value={name}
//           onChangeText={(userdata) => setName(userdata)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.labels}> Enter your Email </Text>
//         <TextInput
//           style={styles.inputStyle}
//           placeholder={"demo@thapa.com"}
//           value={email}
//           onChangeText={(email) => setEmail(email)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.labels}> Enter your mobile </Text>
//         <TextInput
//           style={styles.inputStyle}
//           placeholder={"vinod thapa"}
//           value={phone}
//           onChangeText={(phone) => setPhone(phone)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.labels}> How can we help you? </Text>
//         <TextInput
//           style={[styles.inputStyle, styles.multilineStyle]}
//           placeholder={"Tell us about your self"}
//           value={message}
//           onChangeText={(msg) => setMessage(msg)}
//           numberOfLines={5}
//           multiline={true}
//         />
//       </View>

//       {/* checkbox  */}

//       <View style={styles.wrapper}>
//         <Checkbox
//           value={agree}
//           onValueChange={() => setAgree(!agree)}
//           color={agree ? "#4630EB" : undefined}
//         />
//         <Text style={styles.wrapperText}>
//           I have read and agreed with the TC
//         </Text>
//       </View>

//       {/* submit button  */}

//       <TouchableOpacity
//         style={[
//           styles.buttonStyle,
//           {
//             backgroundColor: agree ? "#4630EB" : "grey",
//           },
//         ]}
//         disabled={!agree}
//         onPress={submit}>
//         <Text style={styles.buttonText}> Contact Us </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     height: "100%",
//     paddingHorizontal: 30,
//     backgroundColor: "#fff",
//   },
//   mainHeader: {
//     fontSize: 24,
//     color: "#344055",
//     fontWeight: "500",
//     paddingTop: 20,
//     paddingBottom: 15,
//     fontFamily: "Nunito_700Bold",
//     textTransform: "capitalize",
//   },
//   description: {
//     fontSize: 18,
//     color: "#7d7d7d",
//     paddingBottom: 20,
//     fontFamily: "WorkSans_400Regular",
//     lineHeight: 25,
//   },

//   inputContainer: {
//     marginTop: 20,
//   },
//   labels: {
//     // fontWeight: "bold",
//     fontSize: 15,
//     color: "#7d7d7d",
//     paddingBottom: 5,
//     fontFamily: "WorkSans_400Regular",
//     lineHeight: 25,
//   },
//   inputStyle: {
//     borderWidth: 1,
//     borderColor: "rgba(0, 0, 0, 0.3)",
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     borderRadius: 2,
//   },
//   multiineStyle: {
//     paddingVertical: 4,
//   },
//   buttonStyle: {
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 30,
//   },
//   buttonText: {
//     color: "#eee",
//   },
//   wrapper: {
//     display: "flex",
//     flexDirection: "row",
//     marginTop: 20,
//     fontFamily: "WorkSans_400Regular",
//   },
//   wrapperText: {
//     marginLeft: 10,
//     color: "#7d7d7d",
//     fontFamily: "WorkSans_400Regular",
//   },
// });

// export default Contact;
