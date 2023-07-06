import AsyncStorage from '@react-native-async-storage/async-storage';
// using AsyncStorage for searching is not an ideal way because the parsing process can be tricky.
// should try to use backend integration if possible, this is just a simple version implementation


// get Search History from AsyncStorage.
export const getHistory = async() => {
    const res = await AsyncStorage.getItem('termHistory')
      if(res)
        return res
    // return empty string if the search history is empty
      return ''
  }


// save Search History into AsyncStorage.  
export const saveHistory = async(term: string)=> {
    // since Asyncstorage value can only be string format and we want to use array, we use '#' to split the value into programm processable search history array variable 
        let termHistory = await AsyncStorage.getItem('termHistory')
        let history = ''

        // if no history then just add this term as the first one, otherwise check if the current term has already existed in the search history. if not then add it to the history and sync to storage.
        if(termHistory===null){
            history = term + '#';

        } else{
            let arr = termHistory.split('#')
            let flag = true;
            for (let i of arr){
                if (i === term){
                    flag = false
                    break;
                }          
            }
            if(flag){
                history = termHistory + term + '#'
            } else{
                history = termHistory
            }
        }
        await AsyncStorage.setItem('termHistory', history)
        return history
}