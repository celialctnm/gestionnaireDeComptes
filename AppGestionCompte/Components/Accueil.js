import React, {useState, useEffect} from 'react';
import {View, Alert, FlatList, StyleSheet, Dimensions} from "react-native";
import {Card, TextInput, Button, Text, List} from "react-native-paper";
import Appareil from "./Appareil";
import ListAccordion from "react-native-paper/src/components/List/ListAccordion";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

function Accueil(props){

    const [data, setData] = useState([]);
    const [img, setImg] = useState("");

    const [loading, setIsLoading] = useState(true);
    const loadData = () => {
        fetch('http://10.1.55.148:56671/get', {
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
        fetch(`http://10.1.55.148:56671/delete/${data.id}/`, {
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

    const test = [
        {
            name: "Seoul",
            population: 21500000,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Toronto",
            population: 2800000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Beijing",
            population: 527612,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "New York",
            population: 8538000,
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Moscow",
            population: 11920000,
            color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    return (
        <View style={styles.accueil}>
            <View>
                <FlatList data={data} renderItem={({item}) => {return renderData(item)}} onRefresh={()=>loadData()} refreshing={loading} keyExtractor={item =>`${item.id}`}/>
            </View>

            <View>
                <Text>Bezier Line Chart</Text>
                <PieChart
                    data={test}
                    width={400}
                    height={300}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 50]}
                    absolute
                />
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