import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "blue",
        alignItems: "center",
        marginBottom: 10,
        height: 150
    },
    thumbnail: {
        height: 100,
        width: 100,
        resizeMode: "contain"
    },
})