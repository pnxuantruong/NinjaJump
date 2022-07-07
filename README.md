# NinjaJump
This is my game using react native CLI to build
## Packages
* React Native Track Package

Installation [here](https://react-native-track-player.js.org/docs/basics/installation)

Add this to index.js file
```sh
// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => require('./service'));
```
Create new file name service.js

```sh
import TrackPlayer from "react-native-track-player"

module.exports = async function () {
  TrackPlayer.addEventListener("remote-play", () => TrackPlayer.play())
  TrackPlayer.addEventListener("remote-pause", () => TrackPlayer.pause())
  TrackPlayer.addEventListener("remote-destroy", ()=> TrackPlayer.destroy())
  TrackPlayer.addEventListener("remote-stop", ()=> TrackPlayer.stop())
}
```


* React Navigation

Make sure to follow the installation [here](https://reactnavigation.org/docs/getting-started)

Also need to install @react-navigation/native-stack

npm:
```sh
npm install @react-navigation/native-stack
```

Yarn:
```sh
yarn add @react-navigation/native-stack
```


* React Native Async Storage

AsyncStorage has been extracted from react-native core. It can now be installed and imported from @react-native-community/async-storage instead of 'react-native'.

With npm
```sh
npm install @react-native-async-storage/async-storage
```

With Yarn
```sh
yarn add @react-native-async-storage/async-storage
```

With Expo CLI
```sh
expo install @react-native-async-storage/async-storage
```

## How to build
- Following these [guides](https://reactnative.dev/docs/environment-setup) to setup environment and create project
- Install packages
- Take code from github
- Run your project

Android:
```sh
npx react-native run-android
```
IOs:
```sh
npx react-native run-ios
```
