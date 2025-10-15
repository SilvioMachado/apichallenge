import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onDateSelected: (date: Date) => void;
}

export const CrossPlatformDateTimePicker = ({
  isVisible,
  onClose,
  onDateSelected,
}: Props) => {
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    onClose();
    if (event.type === 'set' && selectedDate) {
      onDateSelected(selectedDate);
    }
  };

  // For Android, we use the imperative API when the component becomes visible.
  useEffect(() => {
    if (isVisible && Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(),
        onChange,
        mode: 'date',
      });
    }
  }, [isVisible, onChange]);

  // iOS support will be added here in the future.
  if (Platform.OS === 'ios' && isVisible) {
    return null;
  }

  // This component renders nothing itself, it only triggers the imperative Android picker.
  return null;
};
