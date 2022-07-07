/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, Image, Pressable, StatusBar } from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import Ninja from './ninja';
const tracks = [
    {
        id: 0,
        url: require("../tracks/intro.mp3"),
    },
]

const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width

// make fade in effect function
const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}

// play background music
const playMusic = async () => {
    await TrackPlayer.add(tracks).then(() => {
        TrackPlayer.play()
        TrackPlayer.setRepeatMode(RepeatMode.Track)
    }
    )
}
// You can then use your `FadeInView` in place of a `View` in your components:
export default HomeScreen = ({ navigation }) => {
    let ninjaInterval;
    let startBtnColorInterval;
    const [ninjaLeft, setNinjaLeft] = useState(-0.2 * windowWidth)
    const [startBtn, setStartBtn] = useState(false)
    const [startBtnColor, setStartBtnColor] = useState('white')

    // ninja effect running across the screen
    useEffect(() => {
        // run til the end of screen
        if (ninjaLeft < windowWidth * 1.1) {
            ninjaInterval = setInterval(() => {
                setNinjaLeft(ninjaLeft => ninjaLeft + 0.03 * windowWidth)
            }, 20)
        }
        else {
            setStartBtn(true)
            playMusic()
            TrackPlayer.updateOptions({
                stopWithApp: true
            })
        }
        return () => {
            clearInterval(ninjaInterval)
        }
    }, [ninjaLeft])

    // blinking button effect
    useEffect(() => {
        startBtnColorInterval = setInterval(() => {
            setStartBtnColor(startBtnColor => startBtnColor=='white'? 'red':'white')
        }, 1000)
        return () => {
            clearInterval(startBtnColorInterval)
        }
    }, [setStartBtnColor])

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
            <StatusBar hidden />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 15 }
            } >
                {/*display game logo*/}
                <Image style={{
                    flex: 1,
                    position: 'absolute',
                    width: windowWidth * 0.7,
                    height: windowHeight * 0.3,
                    top: 0,
                    resizeMode: 'contain',
                    marginTop: windowHeight * 0.1
                }}
                    source={require('../images/NinjaLogo.png')} />

                {/* start button fade in effect */}
                {startBtn ?
                    <FadeInView style={{ borderRadius: 15, backgroundColor: 'powderblue', marginTop: windowHeight / 2 }}>
                        <Pressable style={styles.button}
                            onPress={() => {
                                // display game play when click
                                TrackPlayer.setRepeatMode(RepeatMode.Off)
                                TrackPlayer.pause()
                                console.log('press')
                                navigation.navigate('Play')
                            }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                letterSpacing: 0.25,
                                color: startBtnColor,
                            }}>{"START GAME"}</Text>
                        </Pressable>
                    </FadeInView>
                    : null
                }

            </View >
            {/* show ninja */}
            <Ninja props={{ x: ninjaLeft, y: windowHeight / 3, height: 60, width: 60, side: false }} />
        </View >
    )
}

const styles = StyleSheet.create({
    button: {
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: 'lime',
        borderBottomColor: 'brown'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
})