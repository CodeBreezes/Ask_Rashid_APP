import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MainLayout from '../components/MainLayout';
import styles from '../styles/HomeScreen.styles';
import { useTranslation } from 'react-i18next';

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

const AboutScreen = () => {
  const { t } = useTranslation();

  return (
    <MainLayout title="About Rashid Bahattab">
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require('../assets/rashidprofile.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{t('name')}</Text>
              <MaterialIcons name="verified" size={20} color="#7442ff" />
            </View>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <FontAwesome key={i} name="star" size={18} color="#FFD700" />
              ))}
              <Text style={styles.reviewText}>  {t('reviews')}</Text>
            </View>

            <Text style={styles.sectionTitle}> {t('aboutTitle')}</Text>
            <Text style={styles.description}>
               {t('aboutDescription')}
            </Text>

            {/* Social Media Icons */}
            <View style={styles.socialIconsRow}>
              {socialLinks.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => openLink(item.url)}>
                  {item.type === 'font' ? (
                    <FontAwesome
                      name={item.name}
                      size={20}
                      color={item.color}
                      style={styles.iconSpacing}
                    />
                  ) : (
                    <Image
                      source={item.source}
                      style={{ width: 24, height: 24, marginHorizontal: 10 }}
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

export default AboutScreen;
