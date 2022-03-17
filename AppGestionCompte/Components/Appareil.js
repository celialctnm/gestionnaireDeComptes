import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import * as Paper from 'react-native-paper';
import {Button, Card, Divider, List} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

async function trouveTextImage (uri_image,byteImage)  {
    let url_api_request = "http://192.168.24.49:54103/image"
    // console.log(url_tweet);
    let text_img = await fetch(url_api_request, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                //Origin: origin
            },
            body: JSON.stringify({
                uri:uri_image,
                byteImage:byteImage
            })

        },
        {mode: 'cors'})
        .then(result => result.json())
        .then(data => {
            console.log(data.uri);
            return data.uri;
        });

    return (text_img)
}


function Appareil() {

    const obtenirTexteImage = () => {
        fetch('http://192.168.24.49:54103/getImg', {
            method:'GET'
        })
            .then(resp=>resp.json())
            .then(text => {
                console.log("Texte récupéré de l'image : ")
                setimg(text);
                console.log(text)
            })
            .catch(error=>console.log(error));
    }

    // The path of the picked image
    const [pickedImagePath, setPickedImagePath] = useState('');

    // This function is triggered when the "Select an image" button pressed
    const showImagePicker = async () => {
        // Ask the user for the permission to access the media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        // Explore the result
        console.log(result);

        if (!result.cancelled) {
            setPickedImagePath(result.uri);
            console.log(pickedImagePath);

        }
    }

    // This function is triggered when the "Open camera" button pressed
    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            saveToPhotos: true,
            uri: true,
            base64: true,

        });

        // Explore the result
        console.log(result);

        if (!result.cancelled) {
            setPickedImagePath(result.uri);
            console.log(pickedImagePath);
            console.log("---------------------")
            console.log(result)
            console.log(await trouveTextImage(pickedImagePath, result.base64))

            }
        }

    const [img, setimg] = useState([]);
    return (
        <View style={styles.screen}>
            <View style={styles.buttonContainer}>
                <Button onPress={showImagePicker} title="Select an image" />
            </View>

            <View style={styles.imageContainer}>
                {
                    pickedImagePath !== '' && <Image
                        source={{ uri: pickedImagePath }}
                        style={styles.image}
                    />
                }
                <View style={styles.buttonContainer}>
                    <Button style={
                        {margin: 10, backgroundColor: '#7D1DFF', width: 240}
                    }
                            mode={"contained"} onPress={openCamera} icon={"camera"}> Prendre une photo </Button>
                    <Button style={{margin: 10, backgroundColor: '#2cd336', width: 150}} onPress={()=>obtenirTexteImage()}> Résultat</Button>
                </View>
                <View style={
                    {margin: 20, backgroundColor: '#e6d4ff'}
                }>
                    <Text> {img} </Text>
                </View>
            </View>
        </View>
    );
}

export default Appareil;

// Kindacode.com
// Just some styles
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 400,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    imageContainer: {
        padding: 30
    },
    image: {
        width: 400,
        height: 300,
        resizeMode: 'cover'
    },
});