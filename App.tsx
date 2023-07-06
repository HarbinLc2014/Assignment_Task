/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import ImageList from './ImageList';
import SearchBar from './SearchBar';
import { getHistory } from './helper';

const SCREEN_WIDTH= Dimensions.get('window').width;

function App(): JSX.Element {

  const [term, setTerm] = useState('');
  const [termHistory, setTermHistory] = useState('');
  
  useEffect(()=>{
  // fetch the past search history and sync it to state
   getHistory().then(res=>{
    setTermHistory(res)
   })
  }, [])

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

    <View style={styles.searchWrapper}>
      <SearchBar term={term} termHistory={termHistory} onChangeTerm={(term)=>setTerm(term)} />
      <TouchableOpacity onPress={()=>setTerm('')}>
        <Image source={require('./close.png')} style={styles.closeIcon}></Image>
      </TouchableOpacity>
    </View>

      <ImageList term={term} setTermHistory={setTermHistory} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchWrapper: { zIndex: 10, flexDirection: 'row', marginTop: 12, width: SCREEN_WIDTH-40, height: 40, marginBottom: 18, marginLeft: 20, backgroundColor:'rgba(0,0,0,0.1)', justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.1, borderRadius: 6 },
  closeIcon: { width: 20, height: 20, marginRight: 20 }

});

export default App;
