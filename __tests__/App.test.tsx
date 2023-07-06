/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import { getHistory, saveHistory } from '../helper';
// Note: import explicitly to use the types shiped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import AsyncStorage from '@react-native-async-storage/async-storage'

it('renders correctly', () => {
  renderer.create(<App />);
});


beforeEach(async()=>{
    await AsyncStorage.clear()
})

describe('getHistory', () => {
    test('if no history, return empty string', async()=> {
        const result = await getHistory()
        expect(result).toEqual('')
    });
    test('returns a string that can be split to an array', async()=>{
       const res1 = await saveHistory('Cat')
       const res2 = await saveHistory('Dog')
        const result = await getHistory()
        expect(result).toEqual('Cat#Dog#')
    })
})

