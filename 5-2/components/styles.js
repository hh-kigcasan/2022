import styled, { ThemeConsumer } from "styled-components";
import { View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import Constants from "expo-constants";

const StatusBar = Constants.statusBarHeight;

// color Theme
export const Colors = {
    primary: "#35858B",
    secondary: "#4FBDBA",
    dark: "#072227",
    light: "azure",
};

const { primary, secondary, dark, light } = Colors;

export const ModalView = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBar + 5}px;
    background-color: ${light};
`;

export const StyledContainer = styled.View`
    justify-content: center;
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBar + 5}px;
    background-color: ${light};
`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const PageLogo = styled.Image`
    width: 100px;
    height: 150px;
    margin: 25px;
`;

export const Avatar = styled.Image`
    width: 55px;
    height: 65px;
    margin: 8px;
`;

export const HiddenButton = styled.TouchableOpacity`
    width: 85px;
    height: 85px;
    margin: 7px;
`;

export const PageTitle = styled.Text`
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    color: ${primary};
`;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${dark};
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${"white"};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${dark};
`;

export const StyledInputLabel = styled.Text`
    color: ${dark};
    font-size: 13px;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 32px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 35px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 13px;
    background-color: ${primary};
    justify-content: center;
    border-radius: 10px;
    margin-vertical: 5px;
    height: 45px;
    margin-top: 15px;
`;

export const ButtonText = styled.Text`
    color: ${light};
    font-size: 18px;
    text-align: center;
`;

export const MsgBox = styled.Text`
    color: ${primary};
    font-size: 13px;
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${dark};
    margin-vertical: 10px;
`;
