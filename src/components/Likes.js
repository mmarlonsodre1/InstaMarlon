import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

export default class Likes extends Component{
    carregaIcone(likeada) {
        return likeada ? require('../../resources/images/s2-check.png') :
                    require('../../resources/images/s2.png')
    }
    
    exibeLikes(likers) {
        if ( likers.length <= 0 ) return;
        return (
            <Text style={styles.likes}>
            {likers.length} {likers.length > 1 ? 'curtidas' : 'curtida'}
            </Text>
        )
    }

    render() {
        const  { foto, likeCallback } = this.props
        return (
            <View>
                <TouchableOpacity onPress={ () => {likeCallback(foto.id)}}>
                    <Image style={styles.botaoLike}
                        source={this.carregaIcone(foto.likeada)}/>
                </TouchableOpacity>

                {this.exibeLikes(foto.likers)}
            </View>
    )}
}

const styles = StyleSheet.create({
    botaoLike: {
      marginBottom: 10,
      height: 40,
      width: 40
    },
    likes: {
      fontWeight: 'bold'
    }
  });