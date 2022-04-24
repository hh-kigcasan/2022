import React, { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Modal,
    Button,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    SubTitle,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    Colors,
    Line,
    ModalView,
} from "./styles";

export default function ChatModal({ socket, start, username }) {
    const [chat, setChat] = useState("");
    const [messages, newMessage] = useState([]);
    const scrollViewRef = useRef();
    const [chatBox, setChatBox] = useState(start);

    useEffect(async () => {
        console.log(socket);
        console.log(start);
        console.log(username);
        socket.on(username, function (data) {
            newMessage((m) => [...m, { sender: data.sender, message: data.message }]);
        });

        socket.on("all", function (data) {
            newMessage((m) => [...m, { sender: data.sender, message: data.message }]);
        });

        return;
    }, []);

    function send(to = "all") {
        newMessage((m) => [...m, { sender: "You", message: chat }]);
        socket.emit("chat_listener", { to: to, sender: username, message: chat });
        setChat("");
    }
    return (
        <>
            <Modal visible={chatBox}>
                <ModalView style={styles.container}>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            scrollViewRef.current.scrollToEnd();
                        }}
                    >
                        {/* CHAT MESSAGES HERE */}
                        {messages.map((m, i) => (
                            <Text key={i} style={{ margin: 8, fontSize: 18 }}>
                                <Text style={{ fontWeight: "bold" }}>{m.sender}: </Text>
                                {m.message}
                            </Text>
                        ))}
                    </ScrollView>
                    <View>
                        <LeftIcon>
                            <Ionicons
                                name={"close"}
                                size={30}
                                color={Colors.primary}
                                onPress={() => setChatBox(false)}
                            />
                        </LeftIcon>
                        <StyledInputLabel></StyledInputLabel>
                        <StyledTextInput value={chat} onChangeText={(text) => setChat(text)} />
                        <RightIcon
                            onPress={() => {
                                send("admin");
                            }}
                        >
                            <Ionicons name={"send-sharp"} size={25} color="green" />
                        </RightIcon>
                    </View>
                </ModalView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.light, padding: 10 },
});
