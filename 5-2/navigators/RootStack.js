import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Colors } from "./../components/styles";

import Signup from "./../screens/Signup";
import Login from "./../screens/Login";
import Tech from "./../screens/Tech";

const Stack = createStackNavigator();

export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyled: { backgroundColor: "transparent" },
                    headerTintColor: Colors.dark,
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeftContainerStyle: { padding: 20 },
                }}
                initialRouteName="Login"
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Tech" component={Tech} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
