import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        fontSize: 14,
        color: 'black',
    },
    activeButtonText: {
        color: 'white',
    },
    arrow: {
        marginLeft: 4,
        fontSize: 14,
    },
});