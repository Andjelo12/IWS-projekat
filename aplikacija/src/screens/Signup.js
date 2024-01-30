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
import FontAwsome from 'react-native-vector-icons/FontAwesome5';

//

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [firstName, setFname] = useState('');
  const [lastName, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  //
  const navigation = useNavigation();

  const signupUser = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    let strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    if (firstName === "") {
      setFirstNameError("Molimo unesite ime");
    }
    if (lastName === "") {
      setLastNameError("Molimo unesite prezime");
    }
    if (email === "") {
      setEmailError("Molimo unesite Email adresu");
    } else if (reg.test(email) === false) {
      setEmailError("Email je u netačnom formatu");
    }
    if (password === "") {
      setPasswordError("Molimo unesite lozinku");
    } else if (strongPassword.test(password) === false) {
      setPasswordError("Lozinka nije dovoljno jaka! (min. 8 karaktera, jedno malo, jedno veliko slovo, jedan broj i jedan specijalan karakter)");
    }
    if (confirmPassword === "") {
      setConfirmPasswordError("Molimo potvrdite lozinku");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Lozinke se ne poklapaju");
    }
    if (firstName !== "" && lastName !== "" && email !== "" && reg.test(email) !== false && password !== "" && strongPassword.test(password) !== false && confirmPassword !== "" && password === confirmPassword) {
      try {
        const response2 = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/account/token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          }
        });

        const data2 = await response2.json();

        if (data2.status === 200){
          sendData(data2.data, firstName, lastName, email, password);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const sendData = async (token, firstName, lastName, email, password) => {
    try {
      const response = await fetch('https://first.stud.vts.su.ac.rs/nwp/api/account/register', {
        method: 'POST',
        headers: {
          'Authorization':'Bearer '+token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
      });

      const responseJson = await response.json();

      if (responseJson.status === 200) {
        Alert.alert("Obaveštenje", "Nalog uspešno kreiran! Proverite vaš email da biste ga aktivirali");
        navigation.goBack();
      } else if (responseJson.status === 409) {
        Alert.alert("Greška", "Korisnik sa navedenim podacima već postoji");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formTopContainer}>
        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
          <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
            Registracija
          </Text>
          <View style={styles.customInputContainer}>
              <Text>Ime</Text>
              <TextInput
                style={{padding: 0}}
                onChangeText={text => {
                  setFname(text);
                  setFirstNameError("");
                }}
              />
          </View>
          {firstNameError !== "" && <Text style={{color: 'red'}}>{firstNameError}</Text>}
          <View style={styles.customInputContainer}>
              <Text>Prezime</Text>
              <TextInput
                style={{padding: 0}}
                onChangeText={text => {
                  setLname(text);
                  setLastNameError("");
                }}
              />
            </View>
            {lastNameError !== "" && <Text style={{color: 'red'}}>{lastNameError}</Text>}
            <View style={styles.customInputContainer}>
              <Text>Email</Text>
              <TextInput
                style={{padding: 0}}
                onChangeText={text => {
                  setEmail(text);
                  setLastNameError("");
                }}
                keyboardType={"email-address"}
                autoCapitalize="none"
              />
            </View>
            {emailError !== "" && <Text style={{color: 'red'}}>{emailError}</Text>}
            <View style={styles.customInputContainer}>
              <Text>Lozinka</Text>
              <View
                style={{flexDirection: 'row', alignContent: 'center'}}>
                <TextInput
                  style={{flex:1}}
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError("");
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
            {passwordError !== "" && <Text style={{color: 'red'}}>{passwordError}</Text>}
            <View style={styles.customInputContainer}>
              <Text>Potvrdite lozinku</Text>
              <View
                style={{flexDirection: 'row', alignContent:'center'}}>
                <TextInput
                  style={{flex:1}}
                  secureTextEntry={!isConfirmPasswordVisible}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    setConfirmPasswordError("");
                  }}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <FontAwsome
                    name={isConfirmPasswordVisible ? 'eye-slash' : 'eye'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {confirmPasswordError !== "" && <Text style={{color: 'red'}}>{confirmPasswordError}</Text>}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                signupUser();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                registruj se
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