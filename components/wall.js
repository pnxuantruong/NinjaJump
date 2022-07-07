import React from "react";
import { Dimensions, View, Stylestreet, Image} from "react-native";

const Wall = ({props}) =>{
    var image = require('../images/wall.png')
    return(
        <View>
            <Image style={{
                position: 'absolute',
                width: props.width,
                height: props.height*1.5,
                left: props.x,
                top: -100,
                resizeMode: 'repeat'}} 
            source = {image}/>
        </View>
    )
}

export default Wall;