import { StyleSheet, Dimensions } from 'react-native';

const { height: windowHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: Dimensions.get('window').width,
    height: windowHeight * 0.5,
  },
  imageList: {
    height: 100,
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    paddingTop: 0,
  },
  buttonSeparator: {
    minHeight: 10,
    maxHeight: 15,
  },
  stockAvailable: {
    fontSize: 16,
    color: 'green',
    marginTop: 4,
  },
  stockUnavailable: {
    fontSize: 16,
    color: 'red',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'black',
  },
  paginationDotInactive: {
    backgroundColor: 'gray',
  },
});
