import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/HomeScreen.styles';

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

const openLink = (url) => {
  Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../assets/rashidprofile.jpg')}
          style={styles.profileImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Rashid Bahattab</Text>
            <MaterialIcons name="verified" size={20} color="#7442ff" />
          </View>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <FontAwesome key={i} name="star" size={18} color="#FFD700" />
            ))}
            <Text style={styles.reviewText}> 5 reviews</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            Rashid, an Emirati public figure from Abu Dhabi, UAE, offers transformative services including 1:1 lifestyle coaching, story-sharing features on his platforms, motivational event speaking, and brand collaborations — all designed to empower his community through authentic connection.
          </Text>

          {/* Updated Social Media Icons Section */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            marginVertical: 16,
            flexShrink: 1,
          }}>
            {socialLinks.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => openLink(item.url)}>
                {item.type === 'font' ? (
                  <FontAwesome
                    name={item.name}
                    size={20}
                    color={item.color}
                    style={{ marginHorizontal: 10 }}
                  />
                ) : (
                  <Image
                    source={item.source}
                    style={{ width: 24, height: 24, marginHorizontal: 0 }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AuthLoading')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
