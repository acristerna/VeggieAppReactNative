import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Keyboard } from 'react-native';

import Svg, {Image,Circle,ClipPath} from 'react-native-svg';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import CustomActionButton from './CustomActionButton';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';

const { width, height } = Dimensions.get('window');

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
class VeggieApp extends Component {
  constructor(props) {
    super(props);

 //this.keyboardHeight = new Animated.Value(0);
    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);

    this.onCloseState = event([
        {
          nativeEvent: ({ state }) =>
            block([
              cond(
                eq(state, State.END),
                set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
              )
            ])
        }
      ]);


    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height/ 3 - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, -1],
        extrapolate: Extrapolate.CLAMP
      });

    this.textInputY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [0, 100],
        extrapolate: Extrapolate.CLAMP
      });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
      });

    this.rotateCross = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [180, 360],
        extrapolate: Extrapolate.CLAMP
      });

  }

//   componentWillMount () {
//     this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
//     this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
//   }

//   componentWillUnmount() {
//     this.keyboardDidShowSub.remove();
//     this.keyboardDidHideSub.remove();
//   }

//   keyboardDidShow = (event) => {
//       Animated.timing(this.keyboardHeight, {
//         duration: event.duration,
//         toValue: event.endCoordinates.height,
//       }).start();
//   };

//   keyboardDidHide = (event) => {
//       Animated.timing(this.keyboardHeight, {
//         duration: event.duration,
//         toValue: 0,
//       }).start();
//   };


  render() {  
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end'
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}
        >
        <Svg height = {height + 50} width={width}>
          <ClipPath id="clip">
            <Circle r = {height + 50} cx={width / 2} />
            </ClipPath>
          <Image
            href={require('../assets/bg.jpg')}
            width = {width}
            height = {height + 50}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip)"
          />
          </Svg>
        </Animated.View>

          
        <Animated.View style={{height: height / 2, transform: [{ translateY: this.buttonY }]}}>
                <Text style = {styles.name}>veggie</Text>
            </Animated.View>

        <View style={{ height: height / 3.5, justifyContent: 'center' }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>LOGIN</Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              ...styles.button,
              backgroundColor: '#05A550',
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }]
            }}
          >
            <Text style = {{fontSize:20, fontWeight: 'bold', color: 'white'}}>SIGN UP</Text>
          </Animated.View>

          
          <Animated.View style={{
            zIndex: this.textInputZindex,
            opacity: this.textInputOpacity,
            transform: [{translateY:this.textInputY}], 
            height: height /3,
             ...StyleSheet.absoluteFill,
            top: null,
            justifyContent: 'center'}}>

            <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                <Animated.View style={styles.closeButton}>
                    <Animated.Text style={{fontSize:15, transform:[{rotate: concat(this.rotateCross, 'deg')}]}}>X</Animated.Text>
                </Animated.View>
            </TapGestureHandler>
            
            <Animated.View style={{ paddingBottom: this.keyboardHeight }}>
            <TextInput placeholder="EMAIL"
            style={styles.textInput}
            placeholderTextColor="black"
            keyboardType='email-address'
            returnKeyType='next'
            />
              <TextInput placeholder="PASSWORD"
            style={styles.textInput}
            placeholderTextColor="black"
            />
        
            <CustomActionButton 
            style = {{    
            backgroundColor: '#91C600',
            height: 60,
            marginHorizontal:20,
            borderRadius:30,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10}}
            title="TestScreen"
            onPress = {() => this.props.navigation.navigate('TestScreen')}
            >
            <Text style = {{fontSize:20, fontWeight: 'bold', color: 'white'}}>LOGIN</Text>
            </CustomActionButton>
            
            </Animated.View>
          </Animated.View>
        </View>
      </View>

    );
  }
}
export default VeggieApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#91C600',
    height: 60,
    marginHorizontal:20,
    borderRadius:30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10

  },

  textInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 5, 
    borderColor: 'rgba(0,0,0,0.2)'
  },

    name: {
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 50,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    closeButton: {
        height: 40, 
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: width / 2 - 20,
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black', 
        shadowOpacity: 0.8
    },

});