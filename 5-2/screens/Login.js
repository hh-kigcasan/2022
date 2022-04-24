import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledButton,
    ButtonText,
    StyledTextInput,
    RightIcon,
    Colors,
    Line,
} from "../components/styles";

import { Formik } from "formik";
import { View, Alert, StyleSheet, ActivityIndicator, Text, Modal } from "react-native";
import Signup from "./Signup";

export default function Login({ socket, location, showAlert }) {
    const [spinner, setSpinner] = useState(false);
    const [screenAlert, setAlert] = useState(false);
    const [hidePassword, toggleHide] = useState(true);
    const [isSigningUp, setSignUp] = useState(false);
    const [message, setMessage] = useState("Invalid");

    function showSpinner(s = 2000) {
        setSpinner(true);
        setTimeout(() => {
            setSpinner(false);
        }, s);
    }

    function showAlert(message = "Invalid", s = 1000) {
        setAlert(true);
        setMessage(message);
        setTimeout(() => {
            setAlert(false);
        }, s);
    }

    socket.on("backToLogin", function () {
        setSignUp(false);
    });

    socket.on("invalid_login", function (data) {
        showAlert(data.message);
    });

    return (
        <>
            <Modal animationType="fade" visible={spinner || screenAlert}>
                {spinner ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.container} />
                ) : (
                    <View style={styles.container}>
                        <SubTitle style={{ textAlign: "center", color: Colors.primary }}>{message}</SubTitle>
                    </View>
                )}
            </Modal>

            {!isSigningUp ? (
                <StyledContainer>
                    <StatusBar style="dark" />
                    <InnerContainer>
                        <PageLogo
                            source={require("./../assets/images/developer-icon.png")}
                            resizeMode="cover"
                        ></PageLogo>
                        <PageTitle>Track Tech</PageTitle>
                        <SubTitle>Account Login</SubTitle>
                        <Formik
                            // Login Handler
                            initialValues={{ username: "", password: "" }}
                            onSubmit={(values) => {
                                socket.emit("validate_login", { values, location });
                                showSpinner(1600);
                                console.log(values);
                            }}
                        >
                            {({ handleChange, handleBlur, values, handleSubmit }) => {
                                return (
                                    <StyledFormArea>
                                        <MyTextInput
                                            label="User Name"
                                            icon="person"
                                            placeholder="Enter your User Name"
                                            onChangeText={handleChange("username")}
                                            onBlur={handleBlur("username")}
                                            value={values.username}
                                        />

                                        <MyTextInput
                                            label="Password"
                                            placeholder="Enter your Password"
                                            icon="lock-closed"
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                            secureTextEntry={hidePassword}
                                            isPassword={true}
                                            hidePassword={hidePassword}
                                            setHidePassword={toggleHide}
                                        />

                                        <StyledButton onPress={handleSubmit}>
                                            <ButtonText>LOGIN</ButtonText>
                                        </StyledButton>
                                        <Line />
                                        <StyledButton
                                            onPress={() => setSignUp(true)}
                                            style={{ backgroundColor: Colors.secondary }}
                                        >
                                            <ButtonText>SIGNUP</ButtonText>
                                        </StyledButton>
                                    </StyledFormArea>
                                );
                            }}
                        </Formik>
                    </InnerContainer>
                </StyledContainer>
            ) : (
                <Signup socket={socket} showAlert={showAlert} />
            )}
        </>
    );
}

function MyTextInput({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) {
    return (
        <View>
            <LeftIcon>
                <Ionicons name={icon} size={30} color={Colors.primary} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon
                    onPress={() => {
                        setHidePassword(!hidePassword);
                    }}
                >
                    <Ionicons name={hidePassword ? "eye-off" : "eye"} size={25} color="grey" />
                </RightIcon>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        backgroundColor: Colors.light,
    },
});
