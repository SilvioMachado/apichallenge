import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    listContainer: { flex: 1 },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
    buttonDisabled: { backgroundColor: '#d3d3d3' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    rangeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});