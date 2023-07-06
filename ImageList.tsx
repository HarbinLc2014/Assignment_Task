import axios from 'axios';
import React, { useMemo, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Text, View } from 'react-native';
const SCREEN_WIDTH= Dimensions.get('window').width;
import { saveHistory } from './helper';

function ImageList ({ term, setTermHistory }){
    const API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=11c40ef31e4961acf4f98c8ff4e945d7&format=json&nojsoncallback=1&text='
    // the debounce delay between each onChange event is set to 0.7s
    const DEBOUNCE_DELAY = 700
    // dataList contains the image response data from flickr api
    const [dataList, setDataList] = useState([])
    // in order to lazy load, we need to implement pagination so the app only fetches more images when the bottom of flatlist is being reached
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [botLoading, setBotLoading] = useState(false)
    const fetchDataAsync = async (page = 0) => {
        if(page === 0){
            setDataList([])
            setLoading(true)
        }
        try{
            // try to increment the page by 1 and fetch the next batch of images
            const req = await axios.get(`${API_URL}${term}&per_page=20&page=${page+1}`)
            const res = await req.data.photos.photo

            // however if this is the first page, just put the response data directly into datalist
            if(page === 0)
            setDataList(res)
            // otherwise we will adhere the response to the previous datalist(lazy load)
            else{
            const list = [...dataList, ...res]
            setDataList(list)
            }

            // increment the page by 1 and disable all loading status
            setLoading(false)
            setPage(page+1)
            setBotLoading(false)
        } catch(error){
            console.log('ERROR', error)
        }
    }

    useEffect (()=>{
        // use setTimeout to implement debounce, usedeferredvalue is not being considered here as the lazy load has already been implemented
        // only start to proceed the search activity if the search term has not been changed for more than 0.7s, to save a lot of uneccessary requests from being sent
        let timer = setTimeout(()=> {
            // we will need to clear all the current pagination and image list data when we initialize a new search.
            setDataList([])
            setPage(0)
            // only do search if the search bar is not empty
            if(term!==''){
                syncHistory(term)
                fetchDataAsync()
            } 
        }, DEBOUNCE_DELAY)
        // clear timer to avoid memory leak
        return()=>{
            clearTimeout(timer)
        }
    },[term])


    const syncHistory = async(term) => {
        // abstract saveHistory method which is using AsyncStorage, to make it easier to test with jest.
        let history = await saveHistory(term)
        setTermHistory(history)
    }

    const renderBotLoading = () =>{
        return botLoading? <View style={{ alignItems: 'center', marginTop: 16 }}><ActivityIndicator size="large" color="#777" /><Text style={{ marginTop: 16 }}>Loading More Images...</Text></View>
        : null
    }
    
    // in order to avoid the imageListItem to re-render in uneccessary circumstances to improve performance, need to use useMemo to reduce the time of re-render as much as possible
        const ImageListItem = useMemo(()=>({item})=> {
        const { farm, server, id, secret } = item
        return <Image source={{ uri: `https://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg` }} style={{ width: SCREEN_WIDTH/2, height: 240 }}></Image>
        },[dataList]);


        return (loading? <View style={{ zIndex: 1, alignItems: 'center', marginTop: 16 }}><ActivityIndicator size="large" color="#777" /><Text style={{ marginTop: 16 }}>Loading...</Text></View>: <FlatList
        data={dataList}
        numColumns={2}
        renderItem={({item}) => <ImageListItem item={item} />}
        keyExtractor={(item, index) => index?.toString() || '-1'}
        onEndReached={()=>{
            setBotLoading(true)
            fetchDataAsync(page)
        }}
        style={{ zIndex: 1 }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={()=>renderBotLoading()}
        />)

}

export default ImageList;