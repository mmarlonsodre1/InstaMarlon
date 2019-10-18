import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  Platform,
  AsyncStorage,
} from 'react-native';
import Post from './Post'

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: []
    }
  }

  componentDidMount() {
    const uri= 'https://instalura-api.herokuapp.com/api/fotos'

    AsyncStorage.getItem('token')
      .then(token => {
        return {
          headers: new Headers({
            "X-AUTH-TOKEN": token
          })
        }
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(json => this.setState({fotos: json}))
  }

  like(idFoto) {
    const foto = this.state.fotos.find(foto => foto.id === idFoto)

    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {
        let novaLista = []
  
        if(!foto.likeada) novaLista = [...foto.likers, {login: usuarioLogado}]
        else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado;
          })
        }
      })

    const fotoAtualizada = {
      ...foto,
      likeada: !foto.likeada,
      likers: novaLista
    }

    const fotos = this.state.fotos
      .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto)
    
    this.setState({fotos})
  }

  adicionaComentario(valorComentario, inputComentario, idFoto) {
    if (valorComentario === '') return;

    const foto = this.state.fotos.find(foto => foto.id === idFoto)
    
    const novaLista = [...foto.comentarios, {
      id: valorComentario,
      login: 'meuUsuario',
      texto: valorComentario
    }];

    const fotoAtualizada = {
      ...foto,
        comentarios: novaLista
    }

    const fotos = this.state.fotos
      .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto)

    this.setState({fotos})
    inputComentario.clear();
  }

  render() {
    return (
      <FlatList style={styles.container}
        keyExtractor={item => item.id}
          data={this.state.fotos}
          renderItem={ ({item}) =>
            <Post foto={item}
                  likeCallback={this.like.bind(this)}
                  comentarioCallback={this.adicionaComentario.bind(this)}/>
          }
      />
    );
  }
};

const margem = Platform.OS == 'ios'? 20 : 0;
const styles = StyleSheet.create({
  container: {
    marginTop: margem
  },
});

