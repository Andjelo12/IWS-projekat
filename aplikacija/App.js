import React from "react";
import {Image, TouchableOpacity} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeLogIn from "./src/after_login/Home";
import Home from "./src/screens/Home";
import About from "./src/screens/About";
import Course from "./src/screens/Course";
import UserData from "./src/screens/UserData";
import CourseDetails from "./src/screens/CourseDetails";
import Signup from "./src/screens/Signup";
import Login from "./src/screens/Login";
import Forget from "./src/screens/Forget";
import AddEvent from "./src/after_login/AddEvent";
import EmailRequest from "./src/screens/EmailRequest";
import Presents from "./src/after_login/Presents";
import AddPresent from "./src/after_login/AddPresent";
import AddInvite from "./src/after_login/AddInvite";
import Invites from "./src/after_login/Invites";
import ChangeEvent from './src/after_login/ChangeEvent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const Stack = createNativeStackNavigator();
  const removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing data: ', error);
        }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* home screen  */}
        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
          }}>
          {(props) => <Home {...props} channelName={""} />}
        </Stack.Screen>

        {/* home screen after login */}
        <Stack.Screen
          name="HomeLogIn"
          component={HomeLogIn}
          options={({ navigation }) => ({
              headerTitleStyle: {
                  fontSize: 25,
              },
              headerTitle: "Moji Događaji",
              headerTitleAlign: "left",
              headerRight: () => (
                  <TouchableOpacity
                      style={{ marginRight: 16 }}
                      onPress={() => {
                          removeData('email');
                          navigation.replace('Home');
                          navigation.reset({
                              index: 0,
                              routes: [{ name: 'Home' }],
                          });
                      }}
                  >
                      <Ionicons name="log-out-outline" size={24} color="black" />
                  </TouchableOpacity>
              ),
          })}
        />

        {/* SignUp Screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "",
            headerTitleAlign: "center",
          }}
        />

          <Stack.Screen
              name="ChangeEvent"
              component={ChangeEvent}
              options={{
                  headerTitleStyle: {
                      fontSize: 25,
                  },
                  headerTitle: "Izmeni događaj",
                  headerTitleAlign: "center",
              }}
              /*options={({ navigation }) => ({
                  headerTitleStyle: {
                      fontSize: 25,
                  },
                  headerTitle: "Izmeni događaj",
                  headerTitleAlign: "left",
                  headerRight: () => (
                      <TouchableOpacity
                          style={{ marginRight: 7}}
                          onPress={() => {
                              navigation.replace('HomeLogIn',{fetchData: true});
                              navigation.reset({
                                  index: 0,
                                  routes: [{ name: 'HomeLogIn' }],
                              });
                          }}
                      >
                          <Image source={require("./icons/icons8-archive-96.png")} style={{width:24,height:24}} />
                      </TouchableOpacity>
                  ),
              })}*/
          />

          <Stack.Screen
              name="AddInvite"
              component={AddInvite}
              options={{
                  headerTitleStyle: {
                      fontSize: 25,
                  },
                  headerTitle: "Dodaj Zvanicu",
                  headerTitleAlign: "center",
              }}
          />

          <Stack.Screen
              name="Invites"
              component={Invites}
              options={{
                  headerTitleStyle: {
                      fontSize: 25,
                  },
                  headerTitle: "Pozivnice",
                  headerTitleAlign: "center",
              }}
          />

        <Stack.Screen
          name="AddPresent"
          component={AddPresent}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "Dodaj poklon",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="Presents"
          component={Presents}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "Pokloni",
            headerTitleAlign: "center",
          }}
        />

          <Stack.Screen
              name="EmailRequest"
              component={EmailRequest}
              options={{
                  headerTitleStyle: {
                      fontSize: 25,
                  },
                  headerTitle: "",
                  headerTitleAlign: "center",
              }}
          />

          {/* SignUp Screen */}
          <Stack.Screen
              name="AddEvent"
              component={AddEvent}
              options={{
                  headerTitleStyle: {
                      fontSize: 25,
                  },
                  headerTitle: "Kreiraj događaj",
                  headerTitleAlign: "center",
              }}
          />

          {/* Forget Screen */}
        <Stack.Screen
          name="Forget"
          component={Forget}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },

            headerTitle: "",
            headerTitleAlign: "center",
          }}
        /> 

        {/* SignUp Screen */}
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "",
            headerTitleAlign: "center",
          }}
        /> 

        {/* Course Screen */}
        <Stack.Screen
          name="Course"
          component={Course}
          options={{
              headerTitleStyle: {
                  fontSize: 25,
              },
              headerTitle: "Događaji",
              headerTitleAlign: "center",
          }}
            /*{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "Courses",
            headerTitleAlign: "center",
          }*/
        />

        {/* UserData Screen  */}
         <Stack.Screen
          name="Student"
          component={UserData}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "Students Data",
            headerTitleAlign: "center",
          }}
        /> 

        {/* About Screen  */}
         <Stack.Screen
          name="About"
          component={About}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "Info",
            headerTitleAlign: "center",
          }}
        /> 

        

        {/* CourseDetails Screen  */}
        <Stack.Screen
          name="CourseDetails"
          component={CourseDetails}
          options={{
            headerTitleStyle: {
              fontSize: 25,
            },
            headerTitle: "Detalji događaja",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
