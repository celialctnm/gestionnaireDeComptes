import React, {useState} from 'react';
import {Text, View, Button} from "react-native";

function Home(){
    const [name, setName] = useState("gdcbhjs")
    return (
        <View>
            <Text> Gestionnaire de compte </Text>
            <Text> {name} </Text>
            <Button title={"Press me"} onPress = {() => setName("Célia")}/>
        </View>
    )
}

export default Home;