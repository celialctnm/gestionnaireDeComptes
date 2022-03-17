import React, {useState, useEffect} from 'react';
import {View, Alert, FlatList, StyleSheet} from "react-native";
import {Card, TextInput, Button, Text, List} from "react-native-paper";
import Appareil from "./Appareil";
import ListAccordion from "react-native-paper/src/components/List/ListAccordion";

function Accueil(props){

    const [data, setData] = useState([]);
    const [img, setImg] = useState("");

    const [loading, setIsLoading] = useState(true);
    const loadData = () => {
        fetch('http://10.1.55.148:55912/get', {
            method:'GET'
        })
            .then(resp=>resp.json())
            .then(article => {
                setData(article);
                setIsLoading(false);
            })
            .catch(error=>console.log(error));
    }

    useEffect(()=>{
        loadData();
    }, [])

    const modifier = (donnees) => {
        props.navigation.navigate('Modifier', {data:donnees});
    }

    const supprimer = (data) => {
        console.log(data.id);
        fetch(`http://10.1.55.148:55912/delete/${data.id}/`, {
            method: 'DELETE',
            headers:  {
                'Content-Type': 'application/json',
            }
        })
            .then(data=>{
                props.navigation.navigate("Accueil")
            })
            .catch(error=>console.log(error));
    }


    const renderData = (item) => {
        return (
            <View>
                <Text> {item.date}</Text>
                <Text> {item.magasin} - {item.montant} $</Text>
                <Button style={
                    {margin: 10, backgroundColor: '#ffa800', width: 150}
                }
                        mode={"contained"}
                        onPress={()=> modifier(item)}>Modifier</Button>
                <Button style={
                    {margin: 10, backgroundColor: 'red', width: 150}
                }
                        mode={"contained"}
                        onPress={()=> supprimer(item)}>Supprimer</Button>
            </View>

        )
    }

    return (
        <View style={styles.accueil}>
            <View>
                <FlatList data={data} renderItem={({item}) => {return renderData(item)}} onRefresh={()=>loadData()} refreshing={loading} keyExtractor={item =>`${item.id}`}/>
            </View>
            <View>
                    <Button style={
                        {margin: 10, backgroundColor: '#7D1DFF', width: 250}
                    }
                            mode={"contained"}
                            onPress={()=> props.navigation.navigate("Ajouter")}>Ajouter une dépense</Button>
                    <Button style={
                        {margin: 10, backgroundColor: '#06da42', width: 250}
                    }
                            mode={"contained"}
                            onPress={()=> props.navigation.navigate("Appareil")}>Appareil</Button>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    accueil: {
        flex: 1,
    }
})

export default Accueil;