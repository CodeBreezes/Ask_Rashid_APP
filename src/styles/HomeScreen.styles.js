// HomeScreen.styles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  profileImage: {
    width,
    height: height * 0.5,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 10,
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
    // iOS 14+ supports gap, but Android doesn't yet; adjust if needed
    marginBottom: 8,
  },
  name: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#333',         // ✅ explicit color
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  reviewText: {
    color: '#F9A825',
    marginLeft: 5,
    fontSize: width * 0.035,
    // optional: add shadow or bold if readability is still an issue
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: width * 0.045,
    color: '#444',         // ✅ explicit color
  },
  description: {
    marginTop: 6,
    color: '#555',         // ✅ explicit color
    fontSize: width * 0.037,
    lineHeight: 22,
  },
  role: {
    marginTop: 12,
    color: '#7442ff',
    fontSize: width * 0.035,
  },
  button: {
    backgroundColor: '#0D5EA6',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },

  // ✅ NEW: for About screen social icons
socialIconsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 12,
},

iconSpacing: {
  marginRight: 12,
},


  // ✅ Optional wrapper (non-conflicting with existing layout)
  profileImageWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
});
