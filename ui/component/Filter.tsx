import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Modal, FlatList, TouchableOpacity } from "react-native";

export interface Category {
    slug: string;
    name: string;
}

interface FilterProps {
    categories: Category[];
    onCategorySelect: (category: Category | null) => void;
}

const Filter = ({ categories, onCategorySelect }: FilterProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleCategoryPress = (category: Category) => {
        setSelectedCategory(category);
        onCategorySelect(category);
        setModalVisible(false);
    };

    const handleClearFilter = () => {
        setSelectedCategory(null);
        onCategorySelect(null);
    };

    return (
        <View style={styles.container}>
            <Button title="Filter" onPress={() => setModalVisible(true)} />
            {selectedCategory && (
                <View style={styles.selectedContainer}>
                    <Text style={styles.selectedCategoryText}>
                        {selectedCategory.name}
                    </Text>
                    <TouchableOpacity onPress={handleClearFilter} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Select a Category</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.slug}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleCategoryPress(item)} style={styles.categoryItemContainer}>
                                    <Text style={styles.categoryItem}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 16,
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
    },
    categoryItem: {
        fontSize: 18,
        padding: 10,
    },
});

export default Filter;
