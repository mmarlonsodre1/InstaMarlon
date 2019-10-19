import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import InputComentario from './InputComentario'
import Likes from './Likes'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height * 0.5;

export default class Post extends Component{
  exibeLegenda(foto){
    if (foto.comentario === '') return;
    return (
      <View style={styles.comentario}>
        <Text style={styles.tituloComentario}>{foto.loginUsuario}</Text>
        <Text>{foto.comentario}</Text>
      </View>
    )
  }

  render () {
    const { foto, likeCallback, comentarioCallback , verPerfilCallback} = this.props;
      return (
          <View>
              <TouchableOpacity style={styles.cabecalho}
                onPress={() => verPerfilCallback(foto.id)}>
                  <Image source={{uri: foto.urlPerfil}}
                      style={styles.fotoPerfil}/>
                  <Text>{foto.loginUsuario}</Text>
              </TouchableOpacity>
              <Image source={{uri: foto.urlFoto}}
                      style={styles.fotoFeed}/>

              <View style = {styles.rodape}>
                <Likes foto = {foto} likeCallback={likeCallback}/>
                {this.exibeLegenda(foto)}

                {foto.comentarios.map(comentario =>
                  <View style={styles.comentario} 
                        key={comentario.id}>
                    <Text style={styles.tituloComentario}>{comentario.login}</Text>
                    <Text>{comentario.texto}</Text>
                  </View>
                )}
                <InputComentario foto = {foto} comentarioCallback={comentarioCallback}/>
              </View>
          </View>
      );
  }
};

const styles = StyleSheet.create({
  cabecalho: {
    margin: 10, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  fotoPerfil: {
    marginRight: 10, 
    borderRadius: 20, 
    width: 40, 
    height: 40
  },
  fotoFeed: {
    width: width, 
    height: height
  },
  rodape: {
    margin: 10
  },
  comentario: {
    flexDirection: 'row'
  },
  tituloComentario: {
    fontWeight: 'bold',
    marginRight: 5
  },
});
  