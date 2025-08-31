import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/HomeScreen.styles'; 


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
            Rashid offers transformative services including 1:1 lifestyle coaching,
            story-sharing features on his platforms, motivational event speaking,
            and brand collaborations – all designed to empower his community
            through authentic connection.
          </Text>

          <Text style={styles.role}>Social Media Influencer</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AuthLoading')}
          >
            <Text style={styles.buttonText}>Book a session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
