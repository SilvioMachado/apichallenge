import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 16, // Adds padding from the screen edges
    padding: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // Android shadow
    elevation: 4,
  },
  thumbnail: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1, // Takes up the remaining space
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
