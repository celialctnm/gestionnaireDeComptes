import React, {useState, useEffect} from 'react';
import {Text, View, Alert, FlatList, StyleSheet, Image} from "react-native";
import {Card, TextInput, Button} from "react-native-paper";

function Add(props){
    const [magasin,setMagasin] = useState("");
    const [date,setDate] = useState("");
    const [montant,setMontant] = useState("");
    const [categorie, setCategorie] = useState("");

    const insertData = () => {
        fetch('http://192.168.24.49:53703/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({magasin:magasin, date:date, montant:montant, categorie:categorie})
        })
            .then(resp=>resp.json())
            .then(data=>{
                props.navigation.navigate('Accueil')
            })
            .catch(error=>console.log(error))
    }

    return (
        <View>
           <TextInput
           label = "Magasin"
           value = {magasin}
           mode = "outlined"
           onChangeText = {text => setMagasin(text)}/>
            <TextInput
                label = "Date"
                value = {date}
                mode = "outlined"
                onChangeText = {text => setDate(text)}/>
            <TextInput
                label = "Categorie"
                value = {categorie}
                mode = "outlined"
                onChangeText = {text => setCategorie(text)}/>
            <TextInput
                label = "Montant"
                value = {montant}
                mode = "outlined"
                onChangeText = {text => setMontant(text)}/>
            <Button style={
                {margin: 10}
            }
            icon={"pencil"}
            mode={"contained"}
            onPress={()=>insertData()}>Insérer dépense</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
    },
})

export default Add;