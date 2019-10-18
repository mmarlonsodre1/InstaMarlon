import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import { Navigation } from "react-native-navigation";

const width = Dimensions.get('screen').width;

export default class Login extends Component{
    constructor() {
        super();
        this.state = {
            usuario:'',
            senha:'',
            mensagem: ''
        }
    }
    
    efetuaLogin() {
        const uri = 'https://instalura-api.herokuapp.com/api/public/login'

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({
                login: this.state.usuario,
                senha: this.state.senha,
            }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch(uri, requestInfo)
            .then(response => {
                if(response.ok) return response.text();
                
                throw new Error("Não foi possível efetuar Login.");
            })
            .then(token => {
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('usuario', this.state.usuario)
                
                Navigation.push(this.props.componentId, {
                    component: {
                    id: 'Feed',
                    name: 'Feed',
                    options: {
                        topBar: {
                            title: {
                                text: "Feed",
                                alignment: "center"
                            }
                        }
                    }
                    },
                });
            })
            .catch(e => this.setState({mensagem: e.message})
        )
    }

  render () {
      return (
          <View style={styles.container}>
              <Text style={styles.titulo}>InstaMarlon</Text>

              <View style={styles.form}>
                <TextInput style={styles.input} 
                    placeholder="Usuário..."
                    onChangeText={texto => this.setState({usuario: texto})}
                    autoCapitalize='none'
                    underlineColorAndroid='transparent'/>
                
                <TextInput style={styles.input} 
                    placeholder="Senha..."
                    onChangeText={texto => this.setState({senha: texto})}
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'/>
                
                <Button title='Login'
                    onPress={this.efetuaLogin.bind(this)}/>
            </View>
            <Text style={styles.mensagem}>
                    {this.state.mensagem}
                </Text>
          </View>
      );
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    form: {
        width:width * 0.8
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 20
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    mensagem: {
        marginTop: 15,
        color: '#e74c3c'
    }
});
  