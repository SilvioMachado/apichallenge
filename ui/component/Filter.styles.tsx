import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1, // Allow this container to shrink if space is limited
        padding: 10,
    },
    selectedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        padding: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        flexShrink: 1, // Allow the selected category pill to shrink
    },
    selectedCategoryText: {
        fontSize: 12,
        fontWeight: "bold",
        flexShrink: 1, // Allow the text itself to shrink
    },
    clearButton: {
        marginLeft: 8,
        padding: 2,
    },
    clearButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
    },
    categoryItemContainer: {
        width: '100%',
        marginBottom: 10,
    },
    categoryItem: {
        fontSize: 18,
        padding: 10,
    },
});