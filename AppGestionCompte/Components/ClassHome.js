import React, {Component} from "react";
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, Button, Alert} from 'react-native';

class ClassHome extends Component{

    state = {
        name: "Célia"
}

    render() {
        return (
                <View>
                    <Text> Hi from ClassHome </Text>
                    <Text> Bienvenue {this.state.name}</Text>
                    <Button title={"Click me"} onPress={() => this.setState({name: "nouvel utilisateur"})} />
                </View>
            )
        }
}

export default ClassHome;