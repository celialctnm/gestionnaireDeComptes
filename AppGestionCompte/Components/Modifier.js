import React, {useState, useEffect} from 'react';
import {Text, View, Alert, FlatList, StyleSheet} from "react-native";
import {Card, TextInput, Button} from "react-native-paper";

function Modifier(props){
    const donnees = props.route.params.data;

    const [magasin,setMagasin] = useState(donnees.magasin);
    const [date,setDate] = useState(donnees.date);
    const [montant,setMontant] = useState(donnees.montant);

    const updateData = () => {
        fetch(`http://10.1.55.148:55912/update/${donnees.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({magasin:magasin, date:date, montant:montant})
        })
            .then(resp=>resp.json())
            .then(data=>{
                props.navigation.navigate('Accueil', {donnees:donnees})
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
                label = "Montant"
                value = {montant.toString()}
                mode = "outlined"
                onChangeText = {text => setMontant(text)}/>
            <Button style={
                {margin: 10}
            }
                    icon={"pencil"}
                    mode={"contained"}
                    onPress={()=>updateData()}>Insérer dépense</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
    }
})

export default Modifier;