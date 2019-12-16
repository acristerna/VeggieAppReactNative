import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
//import LoginForm from './src/components/login-form';
//import SplashPage from './src/components/splash-page';


import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import VeggieApp from './src/components/index';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
    return Image.prefetch(image);
  } else {
    return Asset.fromModule(image).downloadAsync();
   }
  });
}

export default class HomeScreen extends React.Component {
 
  constructor () {
    super ()
    this.state= {
      isReady:false,
    };
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('./src/assets/bg.jpg')]);

    await Promise.all([...imageAssets])
  }

  render () {
    if (!this.state.isReady){
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true})}
          onError={console.warn}
          />
      );
    }
    return <VeggieApp/>;
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
