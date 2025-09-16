import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MainLayout from '../components/MainLayout';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 300; // Full width, adjustable height

// Social media links
const socialLinks = [
  { name: 'tiktok', type: 'image', url: 'https://tiktok.com/@rashid.bahattab', source: require('../assets/icons/tik-tok.png') },
  { name: 'instagram', type: 'font', url: 'https://instagr.am/rashid.bahattab', color: '#C13584' },
  { name: 'youtube', type: 'font', url: 'https://youtube.com/rashidbahattab', color: '#FF0000' },
  { name: 'linkedin', type: 'font', url: 'https://ae.linkedin.com/in/rashid-bahattab-84127a88', color: '#0077B5' },
  { name: 'twitter', type: 'font', url: 'https://x.com/rashid.bahattab', color: '#1DA1F2' },
  { name: 'snapchat', type: 'font', url: 'https://snapchat.com/add/rashidbahattab', color: '#FFFC00' },
  { name: 'globe', type: 'font', url: 'https://rashidbahattab.com/who-is-rashid', color: '#7442ff' },
  { name: 'facebook', type: 'font', url: 'https://facebook.com/rashid.ad.7587', color: '#3b5998' },
];

const AboutScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <MainLayout title="About Rashid Bahattab">
      <View style={styles.container}>
        {/* Fixed Full-Width Image */}
        <Image
          source={require('../assets/rashidprofile.jpg')}
          style={styles.fixedImage}
          resizeMode="cover"
        />

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Spacer */}
          <View style={{ height: IMAGE_HEIGHT }} />

          <View style={styles.content}>
            {/* Name and Verified Badge */}
            <View style={styles.nameRow}>
              <Text style={styles.name}>Rashid Bahattab</Text>
              <MaterialIcons
                name="verified"
                size={18}
                color="#7442ff"
                style={{ marginLeft: 6 }}
              />
            </View>

            {/* Star Ratings */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <FontAwesome key={i} name="star" size={16} color="#FFD700" />
              ))}
              <Text style={styles.reviewText}> 5 reviews</Text>
            </View>

            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              Rashid, an Emirati public figure from Abu Dhabi, UAE, offers transformative services including 1:1 lifestyle coaching, story-sharing features on his platforms, motivational event speaking, and brand collaborations — all designed to empower his community through authentic connection.
            </Text>

            {/* Social Media Icons Row */}
            <View style={styles.socialIconsRow}>
              {socialLinks.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => openLink(item.url)}>
                  {item.type === 'font' ? (
                    <FontAwesome
                      name={item.name}
                      size={24}
                      color={item.color}
                      style={styles.iconSpacing}
                    />
                  ) : (
                    <Image
                      source={item.source}
                      style={[styles.iconSpacing, { width: 24, height: 24 }]}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  fixedImage: {
    width: '100%',
    height: IMAGE_HEIGHT * 1.02,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  socialIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconSpacing: {
    marginHorizontal: 10,
    marginVertical: 6,
  },
});

export default AboutScreen;
