import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
profileImage: {
  width: width,
  height: height * 0.5,
  borderBottomLeftRadius: 24, 
  borderBottomRightRadius: 24,
  overflow: 'hidden',
},

 content: {
  paddingHorizontal: 20,
  paddingVertical: 25,
  backgroundColor: '#f7f4ff',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  marginTop: -20, 
  minHeight: height * 0.6,
},
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginRight: 5,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  reviewText: {
    color: '#F9A825',
    marginLeft: 5,
    fontSize: width * 0.035,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: width * 0.045,
  },
  description: {
    marginTop: 5,
    color: '#444',
    fontSize: width * 0.037,
    lineHeight: 20,
  },
  role: {
    marginTop: 10,
    color: '#7442ff',
    fontSize: width * 0.035,
  },
  button: {
    backgroundColor: '#7442ff',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  }
});

export default styles;
