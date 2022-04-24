import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
    StyledContainer,
    InnerContainer,
    Avatar,
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
    HiddenButton,
} from "../components/styles";

import { Formik } from "formik";
import { View, StyleSheet, Alert } from "react-native";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

export default function Signup({ socket, showAlert }) {
    const [hidePassword, toggleHide] = useState(true);
    const [avatar, setAvatar] = useState("avatar1.png");

    socket.on("invalid_signup", function (data) {
        showAlert(data.message);
    });

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Track Tech</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik
                    initialValues={{ username: "", password: "", cpassword: "" }}
                    onSubmit={(values) => {
                        const { username, password, cpassword } = values;

                        if (password == cpassword && password.length > 7) {
                            socket.emit("validate_signup", { values, avatar });
                        } else {
                            showAlert("Invalid input");
                        }
                    }}
                >
                    {({ handleChange, handleBlur, values, handleSubmit }) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="User Name"
                                icon="person"
                                placeholder="Enter your Name"
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput
                                label="Password"
                                placeholder="Must be at least 8 characters"
                                icon="lock-closed"
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={toggleHide}
                            />
                            <MyTextInput
                                label="Confirm Password"
                                placeholder="Re-type your Password"
                                icon="shield-checkmark"
                                onChangeText={handleChange("cpassword")}
                                onBlur={handleBlur("cpassword")}
                                value={values.cpassword}
                                secureTextEntry={hidePassword}
                                isConfirmed={values.cpassword == values.password}
                            />
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <HiddenButton
                                    onPress={() => {
                                        alert("avatar1.png");
                                        setAvatar("avatar1.png");
                                    }}
                                >
                                    <Avatar
                                        source={require("./../assets/images/avatar1.png")}
                                        resizeMode="cover"
                                    ></Avatar>
                                </HiddenButton>
                                <HiddenButton
                                    onPress={() => {
                                        alert("avatar2.png");
                                        setAvatar("avatar2.png");
                                    }}
                                >
                                    <Avatar
                                        source={require("./../assets/images/avatar2.png")}
                                        resizeMode="cover"
                                    ></Avatar>
                                </HiddenButton>
                                <HiddenButton
                                    onPress={() => {
                                        alert("avatar3.png");
                                        setAvatar("avatar3.png");
                                    }}
                                >
                                    <Avatar
                                        source={require("./../assets/images/avatar3.png")}
                                        resizeMode="cover"
                                    ></Avatar>
                                </HiddenButton>
                                <HiddenButton
                                    onPress={() => {
                                        alert("avatar4.png");
                                        setAvatar("avatar4.png");
                                    }}
                                >
                                    <Avatar
                                        source={require("./../assets/images/avatar4.png")}
                                        resizeMode="cover"
                                    ></Avatar>
                                </HiddenButton>
                                <HiddenButton
                                    onPress={() => {
                                        alert("avatar5.png");
                                        setAvatar("avatar5.png");
                                    }}
                                >
                                    <Avatar
                                        source={require("./../assets/images/avatar5.png")}
                                        resizeMode="cover"
                                    ></Avatar>
                                </HiddenButton>
                                <HiddenButton
                                    onPress={() => {
                                        alert("avatar6.png");
                                        setAvatar("avatar6.png");
                                    }}
                                >
                                    <Avatar
                                        source={require("./../assets/images/avatar6.png")}
                                        resizeMode="cover"
                                    ></Avatar>
                                </HiddenButton>
                            </View>
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>SIGNUP</ButtonText>
                            </StyledButton>
                            <Line />
                            <StyledButton
                                onPress={() => socket.emit("backToLogin")}
                                style={{ backgroundColor: Colors.secondary }}
                            >
                                <ButtonText>CANCEL</ButtonText>
                            </StyledButton>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
}

function MyTextInput({ label, icon, isPassword, hidePassword, isConfirmed, value, ...props }) {
    return (
        <View>
            <LeftIcon>
                <Ionicons name={icon} size={30} color={Colors.primary} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon>
                    <Ionicons name={hidePassword && value.length > 7 ? "checkmark" : "alert"} size={25} color="grey" />
                </RightIcon>
            )}

            {isConfirmed && value.length > 7 && (
                <RightIcon>
                    <Ionicons name="checkmark" size={25} color="grey" />
                </RightIcon>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 8,
        backgroundColor: "aliceblue",
        flexDirection: "row",
        flexWrap: "wrap",
        width: 150,
        height: 150,
    },
    row: {},
});
