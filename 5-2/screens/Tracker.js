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
} from "../components/styles";
import ChatModal from "../components/ChatModal";
import { Picker } from "@react-native-picker/picker";

export default function Tracker({ socket, username, avatar, start, users }) {
    const [location, setLocation] = useState({ latitude: start.latitude, longitude: start.longitude });
    const [delta, setDelta] = useState({ latitudeDelta: 0.015, longitudeDelta: 0.015 });
    const user = { username: username, avatar: avatar, latitude: location.latitude, longitude: location.longitude }; //mock data
    const [chatBox, setChatBox] = useState(false);
    const [chat, setChat] = useState("");
    const [messages, newMessage] = useState([]);
    const scrollViewRef = useRef();
    const [sendTo, setSendTo] = useState("all");

    useEffect(async () => {
        socket.on(user.username, function (data) {
            newMessage((m) => [...m, { sender: data.sender, to: data.to, message: data.message }]);
        });

        socket.on("all", function (data) {
            newMessage((m) => [...m, { sender: data.sender, to: data.to, message: data.message }]);
        });

        return;
    }, []);

    function send(to = "all") {
        newMessage((m) => [...m, { sender: "You", to: to, message: chat }]);
        socket.emit("chat_listener", { to: to, sender: user.username, message: chat });
        setChat("");
    }

    return (
        <>
            <StyledContainer>
                <StatusBar />
                <InnerContainer>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        <TouchableOpacity onPress={() => setChatBox(true)} style={styles.controls}>
                            <Text>Messages</Text>
                            <Ionicons name={"chatbubble-ellipses"} size={30} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setChatBox(true)} style={styles.controls}>
                            <Text>Ticket</Text>
                            <Ionicons name={"folder-open"} size={30} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            title={"Log Off"}
                            onPress={() => {
                                socket.emit("logoff");
                            }}
                            style={styles.controls}
                        >
                            <Text>Logout</Text>
                            <Ionicons name={"exit"} size={30} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <Line />
                    <MapView
                        showsUserLocation={true}
                        // followsUserLocation={true}
                        style={styles.map}
                        mapType={"hybrid"}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: delta.latitudeDelta,
                            longitudeDelta: delta.longitudeDelta,
                        }}
                        onRegionChangeComplete={(e) => {
                            {
                                const { longitudeDelta, latitudeDelta } = e;
                                setDelta({ longitudeDelta: longitudeDelta, latitudeDelta: latitudeDelta });
                            }
                        }}
                        onUserLocationChange={(e) => {
                            // console.log(e.nativeEvent.coordinate);
                            const { longitude, latitude, speed, altitude, heading, timestamp, accuracy } =
                                e.nativeEvent.coordinate;
                            setLocation({ longitude, latitude });
                            socket.emit("update", {
                                username,
                                avatar,
                                longitude,
                                latitude,
                                speed,
                                altitude,
                                heading,
                                timestamp,
                                accuracy,
                            });
                        }}
                    >
                        <Marker
                            title={user.username}
                            description={socket.id}
                            image={require("./../assets/images/you.png")}
                            coordinate={location}
                            centerOffset={{ x: 0.5, y: 1 }}
                        ></Marker>
                    </MapView>
                </InnerContainer>
            </StyledContainer>
            <Modal visible={chatBox}>
                <ModalView style={styles.container}>
                    <Picker selectedValue={sendTo} onValueChange={(name, itemIndex) => setSendTo(name)}>
                        <Picker.Item label="all" value="all" />
                        <Picker.Item label="admin" value="admin" />
                        {users.map((u, i) => (
                            <Picker.Item key={i} label={u} value={u} />
                        ))}
                    </Picker>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            scrollViewRef.current.scrollToEnd();
                        }}
                    >
                        {/* CHAT MESSAGES HERE */}
                        {messages.map((m, i) => (
                            <Text key={i} style={{ margin: 8, fontSize: 18 }}>
                                <Text style={{ fontWeight: "bold" }}>{m.sender}</Text>
                                {m.to !== "all" && ` (messaged ${m.to == user.username ? "You" : m.to})`}: {m.message}
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
                        <StyledTextInput
                            value={chat}
                            onChangeText={(text) => setChat(text)}
                            onSubmitEditing={() => send(sendTo)}
                        />
                        <RightIcon
                            onPress={() => {
                                send(sendTo);
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
    map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
    controls: { marginHorizontal: 15, alignItems: "center" },
});
