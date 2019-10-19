import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  Platform,
  AsyncStorage,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Post from './Post';
import InstaMarlonFetchService from '../services/InstaMarlonFetchService';
import Notificacao from '../api/Notificacao';
import HeaderUsuario from './HeaderUsuario'
import LoadingModal from './LoadingModal'
import { Navigation } from "react-native-navigation";


export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.load();
    Navigation.events().registerComponentDidAppearListener(event => {
      this.load();
    })
  }
  
  load(){
    let uri = '/fotos';
    if(this.props.usuario) uri = `/public/fotos/${this.props.usuario}`;

    this.setState({isLoading:true});
    InstaMarlonFetchService.get(uri)
      .then(json => this.setState({fotos: json, status: 'NORMAL'}))
      .catch(e => this.setState({status: 'FALHA_CARREGAMENTO'}))
    this.setState({isLoading:false});
  }


  buscaPorId(idFoto) {
    return this.state.fotos
      .find(foto => foto.id === idFoto)
  }


  atualizaFotos(fotoAtualizada) {
    const fotos = this.state.fotos
      .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto)

    this.setState({fotos})
  }


  like(idFoto) {
    const listaOriginal = this.state.fotos;
    const foto = this.buscaPorId(idFoto)

    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {
        let novaLista = []
  
        if(!foto.likeada) {
          novaLista = [...foto.likers, {login: usuarioLogado}]
        } else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado;
          })
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista
        }

        this.atualizaFotos(fotoAtualizada);
      })
    
      this.setState({isLoading:true});
      InstaMarlonFetchService.post(`/fotos/${idFoto}/like`)
        .catch(e => {
          this.setState({fotos, listaOriginal})
          Notificacao.exibe('Ops..', 'Algo deu errado!')
        })
        this.setState({isLoading:false});
  }


  adicionaComentario(valorComentario, inputComentario, idFoto) {
    if (valorComentario === '') return;

    const foto = this.buscaPorId(idFoto)
    
    this.setState({isLoading:true});
    InstaMarlonFetchService.post(`/fotos/${idFoto}/comment`, {texto: valorComentario})
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista
        }

        this.atualizaFotos(fotoAtualizada); 
        inputComentario.clear();
      })
      .catch(e => Notificacao.exibe('Ops..', 'Não foi possível adicionar comentário'))
      this.setState({isLoading:false});
  }

  verPerfilUsuario(idFoto) {
    const foto = this.buscaPorId(idFoto);

    Navigation.push(this.props.componentId, {
      component: {
        id: 'Usuario',
        name: 'Usuario',
        passProps: {
          usuario: foto.loginUsuario,
          fotoDePerfil: foto.urlPerfil,
        },
        options: {
            topBar: {
                title: {
                    text: foto.loginUsuario,
                    alignment: "center"
                },
            },
        }
      },
    });
  }

  exibeHeader(){
    if(this.props.usuario) 
      return <HeaderUsuario {...this.props} posts={this.state.fotos.length}/>
  }

  render() {
    if(this.state.status === 'FALHA_CARREGAMENTO')
      return (
        <TouchableOpacity style={styles.container} onPress={this.load.bind(this)}>
          <LoadingModal isLoading={this.state.isLoading}/>
          <Text style={[styles.texto, styles.titulo]}>Ops..</Text>
          <Text style={styles.texto}>Não foi possível carregar o feed</Text>
          <Text style={styles.texto}>Toque para tentar novamente</Text>
        </TouchableOpacity>
      )

    return (
      <ScrollView>
        <LoadingModal isLoading={this.state.isLoading}/>
        {this.exibeHeader()}

        <FlatList style={styles.feed}
        keyExtractor={item => item.id}
          data={this.state.fotos}
          renderItem={ ({item}) =>
            <Post foto={item}
                  likeCallback={this.like.bind(this)}
                  comentarioCallback={this.adicionaComentario.bind(this)}
                  verPerfilCallback={this.verPerfilUsuario.bind(this)}/>
          }
        />
      </ScrollView>
    );
  }
};

const margem = Platform.OS == 'ios'? 20 : 0;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feed: {
    marginTop: margem,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  texto: {
    textAlign: 'center'
  }
});

