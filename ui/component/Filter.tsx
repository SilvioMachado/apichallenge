import React, { useState } from "react";
import { Text, View, Button, Modal, FlatList, TouchableOpacity } from "react-native";
import { styles } from "./Filter.styles";

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

export default Filter;
