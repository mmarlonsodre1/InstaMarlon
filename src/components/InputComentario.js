import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default class InputComentario extends Component{
    constructor() {
        super();
        this.state = {
          valorComentario: ''
        }
      }

    render () {
        return (
        <View style={styles.novoComentario}>
            <TextInput style={styles.input} 
            placeholder='Adicione um comentário...'
            ref={input => this.inputComentario = input}
            onChangeText={texto => this.setState({valorComentario: texto})}
            underlineColorAndroid='transparent'/>

            <TouchableOpacity onPress={ () => {
                this.props.comentarioCallback(this.state.valorComentario, this.inputComentario, this.props.foto.id);
                this.setState({valorComentario: ''})
                }}>
            <Image style={styles.icone}
                source={require('../../resources/images/send.png')} />
            </TouchableOpacity>
        </View>
    )}
}

const styles = StyleSheet.create({
    novoComentario: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    input: {
        height: 40,
        flex: 1
    },
    icone: {
        width: 30,
        height: 30
    }
});