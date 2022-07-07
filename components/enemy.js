import React from "react";
import { Image, Dimensions, View, Stylestreet } from "react-native";

const Enemy = ({ props }) => {
    var image = props.index ? require('../images/enemy_002.png')
                            : require('../images/enemy_001.png')
    return (
        <View>
            <Image style={{
                position: 'absolute',
                width: props.width,
                height: props.height,
                left: props.x,
                bottom: props.y,
                resizeMode: 'stretch'
            }}
                source={image} />
        </View>
    )
}

export default Enemy;