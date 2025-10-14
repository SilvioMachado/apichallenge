import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { SortOrder } from '../../domain/entities/SortOrder';
import { SortBy } from '../../domain/entities/SortBy';
import { styles } from './SortButton.styles';

interface SortButtonProps {
  label: string;
  field: SortBy; // The field this button sorts by
  currentSortField: SortBy | null;
  currentSortOrder: SortOrder;
  onPress: (field: SortBy, order: SortOrder) => void;
}

const SortButton = ({
  label,
  field,
  currentSortField,
  currentSortOrder,
  onPress,
}: SortButtonProps) => {
  const isActive = currentSortField === field;
  const isAsc = isActive && currentSortOrder === SortOrder.ASC;

  const handlePress = () => {
    let newOrder: SortOrder;
    if (isActive) {
      // If already active, toggle order
      newOrder =
        currentSortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    } else {
      // If not active, set to ascending by default
      newOrder = SortOrder.ASC;
    }
    onPress(field, newOrder);
  };

  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
        {label}
      </Text>
      {isActive && (
        <Text style={[styles.arrow, isActive && styles.activeButtonText]}>
          {isAsc ? ' ▲' : ' ▼'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SortButton;
