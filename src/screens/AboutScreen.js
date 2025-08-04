import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/HomeScreen.styles';
import MainLayout from '../components/MainLayout';

const AboutScreen = () => {
  return (
    <MainLayout title="About Rashid Bahattab">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageWrapper}>
          <Image
            source={require('../assets/rashidprofile.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          {/* Name and Verified Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>Rashid Bahattab</Text>
            <MaterialIcons name="verified" size={18} color="#7442ff" style={{ marginLeft: 6 }} />
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
            Rashid offers transformative services including 1:1 lifestyle coaching,
            story-sharing features on his platforms, motivational event speaking,
            and brand collaborations – all designed to empower his community
            through authentic connection.
          </Text>


          {/* Social Media Icons Row */}
          <View style={styles.socialIconsRow}>
            <FontAwesome name="facebook" size={18} color="#3b5998" style={styles.iconSpacing} />
            <FontAwesome name="instagram" size={18} color="#C13584" style={styles.iconSpacing} />
            <FontAwesome name="twitter" size={18} color="#1DA1F2" style={styles.iconSpacing} />
            <FontAwesome name="linkedin" size={18} color="#0077B5" style={styles.iconSpacing} />
          </View>

        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default AboutScreen;
