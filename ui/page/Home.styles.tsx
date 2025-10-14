import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, // Add horizontal padding to the main container
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButtonContainer: {
    // This will now just group the sort buttons
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
