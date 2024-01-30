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

export default function Forget() {
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  //
  const navigation = useNavigation();

  const forgetUser = async () => {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(email===""){
			setEmailErrorMessage("Unesite e-mail adresu!");
		  // this.setState({email:'Please enter Email address'})	
		} else if (reg.test(email) === false){
		    setEmailErrorMessage("Email je u lošem formatu!");
		  // this.setState({email:'Email is Not Correct'})
		  // return false;
		}
        if (email !== "" && reg.test(email) !== false){
          try {
            const response2 = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/account/token', {
              method: 'POST',
              headers: {
                'Accept': 'application/json'
              }
            });

            const data2 = await response2.json();

            if (data2.status === 200){
              sendData(data2.data, email);
            }

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
  };

  const sendData = async (token, email) => {
    try {
      const response = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/account/forget', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+token,
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      });
      const responseJson = await response.json();

      if (responseJson.status === 200) {
        Alert.alert("Obaveštenje", "Ukoliko imate nalog na našem sajtu link za reset lozinke vam je poslat.");
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
            {/*  */}
            <Text style={{color: '#fff', fontSize: 27, fontWeight: 'bold'}}>
            Zaboravljena lozinka
            </Text>
            <View style={styles.customInputContainer}>
              <Text>Email</Text>
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
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={styles.forgetButton}
              onPress={() => {
                forgetUser();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                Pošalji link za reset lozinke
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
    padding: 20,
  },
  customInputContainer: {
    marginVertical: 10,
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
