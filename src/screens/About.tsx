import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const About = () => {
  const features = [
    'Diverse prompts: funny, thought-provoking, genre-specific, endless possibilities!',
    'AI styles: formal, casual, even poetic, find your perfect voice.',
    'Customize prompts: tweak and refine to get just the right spark. ✨',
    'Save favorites: keep inspiring prompts at your fingertips.',
  ];

  const benefits = [
    "Beat writer's block, conquer creative ruts, ignite new ideas.",
    'Brainstorm stories, generate art ideas, write better content with ease. ✍️',
    'Explore different styles, experiment with new genres, expand your horizons.',
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Features:</Text>
      <FlatList
        style={styles.abouts}
        data={features}
        // keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.abouts}>
            <Text style={styles.points}>• {item}</Text>
          </View>
        )}
      />
      <Text style={styles.heading}>Benefits:</Text>
      <FlatList
        style={styles.abouts}
        data={benefits}
        // keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.abouts}>
            <Text style={styles.points}>• {item}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
  },
  abouts: {
    marginLeft: 10,
    marginVertical: 6,
  },
  points: {
    color: '#333333',
    fontWeight: '500',
    lineHeight: 20,
  }
});
