/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, Image, Pressable, StatusBar } from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wall from './wall'
import Ninja from './ninja';
import Enemy from './enemy';
import Dash from './dash';

const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width
const gravity = windowHeight * 0.005 // ninja falling speed
const wallWidth = windowWidth * 0.1

// music items
const tracks = [
  {
    id: 0,
    url: require("../tracks/dash_sound.wav"),
  },
  {
    id: 1,
    url: require("../tracks/enemy_dead.mp3"),
  },
  {
    id: 2,
    url: require("../tracks/game_over.mp3"),
  },
  {
    id: 3,
    url: require("../tracks/background2.mp3"),
  },
  {
    id: 4,
    url: require("../tracks/intro.mp3")
  }
]

// this function use for saving high score
const _storeData = async () => {
  try {
    await AsyncStorage.setItem(
      'highScore',
      JSON.stringify(highScore)
    );
  } catch (error) {
    // Error saving data
    console.log(e)
  }
};

// this function use for retrieving high score
const _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('highScore');
    if (value !== null) {
      // We have data!!
      highScore = parseInt(value)
      console.log(value);
    }
    else {
      highScore = 0
      _storeData()
    }
  } catch (error) {
    console.log(e)
    // Error retrieving data
  }
};

var highScore = _retrieveData()

export default PlayPart = ({ navigation }) => {

  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  //ninja
  const ninjaSize = { height: windowWidth * 0.2, width: windowWidth * 0.2 }
  const [ninjaBottom, setNinjaBottom] = useState(-windowHeight * 0.4)
  const [ninjaSide, setNinjaSide] = useState(false) //this is direction of movement: false is left, true is right
  const [ninjaLeft, setNinjaLeft] = useState(windowWidth - wallWidth - ninjaSize.width)

  const enemyFlyingSpeed = { x: windowWidth * 0.01, y: windowHeight * 0.01 }
  const enemySize = { height: windowWidth * 0.15, width: windowWidth * 0.15 }

  // enemy1
  const [enemyBottom1, setEnemyBottom1] = useState(0)
  const [enemySide1, setEnemySide1] = useState(true) //this is direction of movement: false is left, true is right
  const [enemyLeft1, setEnemyLeft1] = useState(windowWidth / 2)

  // enemy2
  const [enemyBottom2, setEnemyBottom2] = useState(0.1 * windowHeight)
  const [enemySide2, setEnemySide2] = useState(true) //this is direction of movement: false is left, true is right
  const [enemyLeft2, setEnemyLeft2] = useState(windowWidth / 2)

  // dash
  const [dashEffect, setDashEffect] = useState('none') // use for handling lightning effect of dash
  const dashProps = { x: (windowWidth * 0.92 - wallWidth - ninjaSize.width), y: windowHeight * 0.1 }

  //interval
  let gameTimerId
  let enemyTimerId1
  let enemyTimerId2

  // reload game play
  const startGame = () => {
    TrackPlayer.reset()
    TrackPlayer.setRepeatMode(RepeatMode.Off)
    setIsGameOver(false)
    setNinjaBottom(-windowHeight * 0.4)
    setEnemyBottom1(0)
    setEnemyBottom2(0.5 * windowHeight)
    setScore(0)
  }

  // ninja falling
  useEffect(() => {
    if (!isGameOver && ninjaBottom > -windowHeight) {
      gameTimerId = setInterval(() => {
        setNinjaBottom(ninjaBottom => ninjaBottom = ninjaBottom - gravity)
      }, 20)
    }
    else {
      gameOver()
    }
    return () => {
      clearInterval(gameTimerId)
    }
  }, [ninjaBottom])

  // enemy1 movement
  useEffect(() => {
    if (!isGameOver) {
      if (enemyBottom1 > -windowHeight) {
        // enemyBottom decrease til the bottom of screen
        enemyTimerId1 = setInterval(() => {
          // update the left position of the enemy 
          setEnemyLeft1(enemyLeft1 => {
            // redirect enemy if near wall
            if (!enemySide1 && enemyLeft1 <= wallWidth + enemySize.width) setEnemySide1(true)
            else if (enemySide1 && enemyLeft1 >= (windowWidth - 2 * wallWidth - enemySize.width)) setEnemySide1(false)
            return enemyLeft1 + (enemySide1 ? enemyFlyingSpeed.x : -enemyFlyingSpeed.x)
          }
          )
          // update the bottom position of the enemy 
          setEnemyBottom1(enemyBottom1 => enemyBottom1 = enemyBottom1 - enemyFlyingSpeed.y)
        }, 10)
      }
      else {
        // when the enemy get the bottom of screen, set its props again
        setEnemyLeft1(enemyLeft1 => enemyLeft1 = Math.random() * (windowWidth * 0.8 - 60) + windowWidth * 0.1)
        setEnemyBottom1(enemyBottom1 => enemyBottom1 = 0.2 * windowHeight)
      }
    }
    return () => {
      clearInterval(enemyTimerId1)
    }
  }, [enemyBottom1])

  // enemy2 movement similar to enemy1
  useEffect(() => {
    if (!isGameOver) {
      if (enemyBottom2 > -windowHeight) {
        enemyTimerId2 = setInterval(() => {
          setEnemyLeft2(enemyLeft2 => {
            if (!enemySide2 && enemyLeft2 <= wallWidth + enemySize.width) setEnemySide2(true)
            else if (enemySide2 && enemyLeft2 >= (windowWidth - 2 * wallWidth - enemySize.width)) setEnemySide2(false)
            return enemyLeft2 + (enemySide2 ? enemyFlyingSpeed.x : -enemyFlyingSpeed.x)
          }
          )
          setEnemyBottom2(enemyBottom2 => enemyBottom2 = enemyBottom2 - enemyFlyingSpeed.y)
        }, 10)
      }
      else {
        setEnemyLeft2(enemyLeft2 => enemyLeft2 = Math.random() * (windowWidth * 0.8 - 60) + windowWidth * 0.1)
        setEnemyBottom2(enemyBottom2 => enemyBottom2 = 0.1 * windowHeight)
      }
    }
    return () => {
      clearInterval(enemyTimerId2)
    }
  }, [enemyBottom2])


  // ninja dash function
  const dash = () => {
    // when the game its not over
    if (!isGameOver && (ninjaBottom < -ninjaSize.height)) {

      var increaseScore = 0

      // sound effect
      TrackPlayer.reset()
      TrackPlayer.add(tracks[0]).then(() => {
        TrackPlayer.play()
      })

      setDashEffect('flex') // reveal the lightning 
      setNinjaSide(!ninjaSide) // set ninja's movement direction again
      setNinjaBottom(ninjaBottom => ninjaBottom + dashProps.y) //  add ninja bottom position to dash height
      setNinjaLeft(ninjaSide ? windowWidth - wallWidth - ninjaSize.width : windowWidth * 0.08) // change wall

      // check collision with enemy1
      if (checkCollision(enemyLeft1, enemyBottom1, enemySide1)) {
        increaseScore = increaseScore + 1
        // if true, enemy is destroyed, then rest enemy position
        setEnemyLeft1(enemyLeft1 => enemyLeft1 = Math.random() * (windowWidth * 0.8 - 60) + windowWidth * 0.1)
        setEnemyBottom1(enemyBottom1 => enemyBottom1 = 0.1 * windowHeight)

        // point plus effect sound
        TrackPlayer.reset()
        TrackPlayer.add(tracks[1]).then(() => {
          TrackPlayer.play()
        })
      }

      // check collision with enemy2
      if (checkCollision(enemyLeft2, enemyBottom2, enemySide2)) {
        increaseScore = increaseScore + 1
        setEnemyLeft2(enemyLeft2 => enemyLeft2 = Math.random() * (windowWidth * 0.8 - 60) + windowWidth * 0.1)
        setEnemyBottom2(enemyBottom2 => enemyBottom2 = 0.05 * windowHeight)
        TrackPlayer.reset()
        TrackPlayer.add(tracks[1]).then(() => {
          TrackPlayer.play()
        })
      }
      // update score
      setScore(score => score + increaseScore)
    }
  }


  const dashEnd = () => {
    // hide the lightning 
    setDashEffect('none')
  }

  // check the relative position of the point relative to the line
  const checkRelativePosition = (directionVector, point0, pointToCheck) => {
    if (point0.x == pointToCheck.x) return false
    var result = point0.y + (pointToCheck.x - point0.x) * (directionVector.y / directionVector.x)
    return pointToCheck.y >= result ? true : false
    // true: pointToCheck is above the line, false: pointToCheck is under the line
  }

  //check for collisions
  const checkCollision = (left, bottom, side) => {
    var direction = ninjaSide ? 1 : -1
    var x0 = ninjaLeft + ninjaSize.width / 2
    var y0 = ninjaBottom + ninjaSize.height
    var deltaX = direction * dashProps.x //dash's width
    var deltaY = dashProps.y // dash's height

    // take top point of enemy: topEnemy(x,y)
    var x = left + enemySize.width / 2
    var y = bottom + enemySize.height

    // check the constrain
    // 
    var posTopToUpperLine = checkRelativePosition(directionVector = { x: deltaX, y: deltaY }, point0 = { x: x0, y: y0 }, pointToCheck = { x: x, y: y })
    var posTopToLowerLine = checkRelativePosition(directionVector = { x: deltaX, y: deltaY }, point0 = { x: x0, y: y0 - ninjaSize.height }, pointToCheck = { x: x, y: y })
    //
    var posBottomToUpperLine = checkRelativePosition(directionVector = { x: deltaX, y: deltaY }, point0 = { x: x0, y: y0 }, pointToCheck = { x: x, y: y - enemySize.height })
    var posBottomToLowerLine = checkRelativePosition(directionVector = { x: deltaX, y: deltaY }, point0 = { x: x0, y: y0 - ninjaSize.height }, pointToCheck = { x: x, y: y - enemySize.height })

    // collise if topPoint bettween 2 line or bottomPoint between 2 line
    if ((!posTopToUpperLine && posTopToLowerLine) || (!posBottomToUpperLine && posBottomToLowerLine)) // collised
    {
      // if the movement directtion of ninja and enemy are the same then the enemy is destroyed
      if (ninjaSide == side) {
        return true
      }
      else {
        gameOver()
      }
    }
    return false
  }

  const gameOver = () => {
    //update highscore and store it
    if (highScore < score) {
      highScore = score
      _storeData()
    }
    clearInterval(gameTimerId)
    clearInterval(enemyTimerId1)
    clearInterval(enemyTimerId2)
    setIsGameOver(true) // to stop game

     // lose sound effect
    TrackPlayer.reset()
    TrackPlayer.add(tracks[2]).then(() => {
      TrackPlayer.play().then(() => {
        // play another background sound
        TrackPlayer.reset()
        TrackPlayer.add(tracks[3]).then(() => {
          TrackPlayer.play()
          TrackPlayer.setRepeatMode(RepeatMode.Track)
        })
      })
    })

  }


  return (
    <TouchableWithoutFeedback onPressIn={dash} onPressOut={dashEnd}>
      <View style={styles.container}>

        <StatusBar hidden />
        {/*show background image */}
        <Image style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: windowHeight,
          width: windowWidth,
          resizeMode: 'stretch'
        }}
          source={require('../images/background_003.png')}
        />
        {/*show current score */}
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 40, color: 'white' }}>{score}</Text>

        {/*show walls */}
        <Wall props={{
          x: 0,
          y: 0,
          height: windowHeight * 1.5,
          width: wallWidth
        }}
        />

        <Wall props={{
          x: windowWidth - wallWidth,
          y: 0,
          height: windowHeight * 1.5,
          width: wallWidth
        }}
        />
        {/*show ninja */}
        <Ninja props={{
          x: ninjaLeft,
          y: ninjaBottom,
          height: ninjaSize.height,
          width: ninjaSize.width,
          index: ninjaSide
        }}
        />

        {/*show enemy */}
        <Enemy props={{
          x: enemyLeft1,
          y: enemyBottom1,
          height: enemySize.height,
          width: enemySize.width,
          index: enemySide1
        }}
        />

        <Enemy props={{
          x: enemyLeft2,
          y: enemyBottom2,
          height: enemySize.height,
          width: enemySize.width,
          index: enemySide2
        }}
        />

        {/*show dash effect(lightning) */}
        <Dash props={{
          x: wallWidth,
          y: ninjaBottom,
          height: ninjaSize.height,
          width: windowWidth * 0.8,
          index: ninjaSide,
          display: dashEffect
        }}
        />
        {// if game is over show lose image, replay button, back to home button, highscore
        !isGameOver ?
          null :
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', display: (isGameOver ? 'flex' : 'none'), margin: 10 }}>
            {/*lose image */}
            <Image style={{
              position: 'absolute',
              width: '70%',
              height: '30%',
              top: 0,
              resizeMode: 'stretch',
              marginBottom: 10,
            }}
              source={require('../images/youlose.png')} />

            {/*replay button*/}
            <Pressable style={styles.button}
              onPress={() => {
                startGame()
              }}>
              <Text style={styles.text}>{"REPLAY"}</Text>
            </Pressable>

              {/*back to home button*/}
            <Pressable style={styles.button2}
              onPress={() => {
                TrackPlayer.reset().then(() => {
                  TrackPlayer.add(tracks[4])
                  TrackPlayer.play()
                })
                // go home
                navigation.goBack()
              }}>
              <Text style={styles.text}>{"BACK TO HOME"}</Text>
            </Pressable>
              
              {/*show highscore */}
            <View style={styles.button3}>
              <Text style={styles.text}>Hight score: {highScore}</Text>
            </View>
          </View>
        }
      </View>
    </TouchableWithoutFeedback>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  button: {
    margin: 5,
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
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  button2: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: 'red',
    borderBottomColor: 'brown'
  },
  button3: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: 'brown',
    borderBottomColor: 'brown'
  },

})