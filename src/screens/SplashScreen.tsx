import { StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import LottieView from 'lottie-react-native'

interface SplashScreenProps {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const SplashScreen = ({setIsLoading}: SplashScreenProps): JSX.Element => {
  return (
    <View style={styles.conatiner}>
      <LottieView 
      style={{width: '70%', height: '70%'}}
      source={require('../assets/Animation - 1705588124105.json')}
      autoPlay
      loop={false}
      resizeMode='cover'
      onAnimationFinish={() => setIsLoading(false)}
      />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        backgroundColor: '#D24545'
    }
})