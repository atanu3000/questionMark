import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const About = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>
        Welcome to Question Mark an AI Prompt App
      </Text>
      <View style={styles.seprator}></View>
      <Text style={styles.caption}>- Where Text and Images Unite!</Text>
      <View style={styles.seprator}></View>
      <View style={styles.lottieContainer}>
      <LottieView
        style={styles.lottieView}
        source={require('../assets/Animation - 1705588124105.json')}
        autoPlay
        loop
        resizeMode="cover"
      />
      </View>
      <Text style={styles.introduction}>
        Welcome to Question Mark, your gateway to the next generation of text
        and image generation powered by cutting-edge AI models - Gemini-Pro and
        Gemini-Pro-Vision. Developed with state-of-the-art technology, our app
        is designed to transform your prompts into rich, contextually relevant
        content with just a few clicks.
      </Text>
      <Text style={styles.subHeading}>Key Features :</Text>
      <View style={{paddingLeft: 10}}>
        <Text style={styles.points}>1. Gemini-Pro Model:</Text>
        <Text style={styles.abouts}>
          LLM (Language Learning Model): Unleashing the power of Gemini-Pro's
          LLM, Question Mark can comprehend and generate human-like text.
          Whether you're drafting an email, crafting a story, or seeking
          creative inspiration, our app harnesses the potential of language like
          never before.
        </Text>
        <Text style={styles.points}>2. Gemini-Pro-Vision Model:</Text>
        <Text style={styles.abouts}>
          LIM (Image Understanding Model): Pushing the boundaries of AI,
          Question Mark integrates the Gemini-Pro-Vision model, allowing you to
          generate text not only from written prompts but also from images.
          Describe a scene, provide an image prompt, and watch as the app weaves
          descriptive and engaging narratives.
        </Text>
      </View>
      <Text style={styles.subHeading}>Why Choose Question Mark?</Text>
      <View style={{paddingLeft: 10}}>
        <Text style={styles.abouts}>
          ● Versatility: From pure text prompts to image-driven inspiration, our
          app seamlessly combines the power of Gemini-Pro and Gemini-Pro-Vision,
          offering a versatile solution for content generation.
        </Text>
        <Text style={styles.abouts}>
          ● User-Friendly Interface: With an intuitive design, Question Mark
          ensures that both novice users and seasoned professionals can navigate
          the app effortlessly, making AI-assisted content creation accessible
          to everyone.
        </Text>
        <Text style={styles.abouts}>
          ● Smart Suggestions: Benefit from smart suggestions that enhance your
          prompts and guide the AI models to produce content tailored to your
          needs. Fine-tune your input, and let Question Mark do the rest.
        </Text>
        <Text style={styles.abouts}>
          ● Privacy and Security: We understand the importance of privacy. Rest
          assured, your data is handled with the utmost care, and our app
          prioritizes security to ensure a worry-free user experience.
        </Text>
      </View>
      <Text style={styles.subHeading}>How It Works:</Text>
      <View style={{paddingLeft: 10}}>
        <Text style={styles.points}>1. Input Prompts:</Text>
        <Text style={styles.abouts}>
          Enter your text prompt or upload an image to spark the creative
          process.
        </Text>
        <Text style={styles.points}>2. AI Processing:</Text>
        <Text style={styles.abouts}>
          Gemini-Pro and Gemini-Pro-Vision work in tandem to analyze and
          understand your input.
        </Text>
        <Text style={styles.points}>3. Output Generation:</Text>
        <Text style={styles.abouts}>
          Witness the magic as Question Mark generates contextually relevant and
          engaging text based on your prompt, whether textual or visual.
        </Text>
      </View>
      <Text style={styles.subHeading}>
        Join the AI Revolution with Question Mark:
      </Text>
      <Text style={styles.abouts}>
        Question Mark represents a leap forward in AI-assisted content
        generation. Whether you're a writer, marketer, student, or anyone
        seeking innovative solutions, our app brings the future of AI right to
        your fingertips. Embrace the power of Gemini-Pro and Gemini-Pro-Vision,
        and let your creativity soar with Question Mark.
      </Text>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: '200',
    color: '#000',
    textAlign: 'center',
    marginVertical: 16,
  },
  seprator: {
    height: 1,
    backgroundColor: '#BBB',
  },
  caption: {
    marginVertical: 5,
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#000',
    textAlign: 'center',
  },
  lottieContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    marginTop: 25,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 40,
  },
  lottieView: {
    width: 100,
    height: 100,
    backgroundColor: '#D2454577',    
  },
  introduction: {
    marginTop: 25,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '300',
    color: '#000',
    textAlign: 'justify',
  },
  subHeading: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
    marginTop: 5,
  },
  points: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  abouts: {
    textAlign: 'justify',
    fontWeight: '300',
    color: '#000',
    marginBottom: 12,
    lineHeight: 19,
  },
});
