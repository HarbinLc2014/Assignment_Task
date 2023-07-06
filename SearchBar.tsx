import React, { useState } from 'react';
import { Dimensions, FlatList, Image, LayoutAnimation, Text, TextInput, TouchableOpacity, View } from 'react-native';
const SCREEN_WIDTH= Dimensions.get('window').width;

function SearchBar ({ term, onChangeTerm, termHistory }){

    const [barVisible, setBar] = useState(false)
    // const [historyData, setData] = useState(['Cat', 'Dog', 'Car', 'Plane', 'Train'])
    const historyData = termHistory.split('#')
    return (
        <View style={{ zIndex: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 99 }}>
      <TouchableOpacity onPress={()=>{
        LayoutAnimation.easeInEaseOut()
        setBar(!barVisible)}}>
        <Image source={require('./search.png')} style={{ width: 20, height: 20, marginLeft: 16 }}></Image>
      </TouchableOpacity>
        <TextInput
        value={term}
        onChangeText={(text)=>{
        setBar(false)
        onChangeTerm(text)
        }}
        style={{ paddingLeft: 16, height: 40, width: 250 }}>
        </TextInput>
    </View>
{ <View style={{ borderBottomWidth: barVisible?0.6: 0, borderColor: '#bbb', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, width: SCREEN_WIDTH-40, height: barVisible? 200: 0, backgroundColor: 'rgba(230,230,230,0.9)', zIndex: 98, elevation: 10, position: 'absolute', top: 36 }}>
    <FlatList 
            data={historyData}
            renderItem={({item}) => <TouchableOpacity onPress={()=>{
                onChangeTerm(item)
                setBar(false)
            }}><Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 32, marginTop: 16 }}>{item}</Text></TouchableOpacity>}
            keyExtractor={(item, index) => index?.toString() || '-1'}
    />
    </View>}
    </View>
)
}

export default SearchBar