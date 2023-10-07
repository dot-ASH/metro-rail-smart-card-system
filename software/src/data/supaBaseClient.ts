// import 'react-native-url-polyfill/auto';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// import {createClient} from '@supabase/supabase-js';
// import {SUPABASE_KEY} from '@env';

// const supabaseUrl = 'https://unhvsygaohvjoeuxbans.supabase.co';
// const supabaseKey = SUPABASE_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     persistSession: true,
//   },
// });

// export default supabase;

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import {SUPABASE_KEY} from '@env';

const supabaseUrl = 'https://unhvsygaohvjoeuxbans.supabase.co';
const supabaseKey = SUPABASE_KEY;

// Create a custom storage implementation using AsyncStorage
// const customStorage = {
//   async get(key: string) {
//     return await AsyncStorage.getItem(key);
//   },
//   async set(key: string, data: string) {
//     return await AsyncStorage.setItem(key, data);
//   },
//   async remove(key: string) {
//     return await AsyncStorage.removeItem(key);
//   },
// };

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
