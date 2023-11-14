import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react';
import supabase from '../data/supaBaseClient';

interface userSecureData {
  user_index: number;
  balance: string;
  verify_pin: string;
}

// interface stationData {
//   id: number;
//   distance: number;
//   station_code: string;
//   station_name: string;
// }

interface userData {
  name: string;
  address: string;
  station: any;
  id: number;
  phn_no: string;
  email: string;
  user_data: userSecureData[];
  default_index: number;
  image_url: string;
}

interface AuthContextType {
  user: userData[];
  setUsers: (users: userData[]) => void;
  refresh: boolean;
  refreshModule: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: [],
  setUsers: () => {},
  refresh: false,
  refreshModule: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUsers] = useState<userData[]>([]);
  const [sessionPhn, setSessionPhn] = useState<String | undefined>();
  const [sessionMail, setSessionMail] = useState<String | undefined>();
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshModule = () => {
    setRefresh(prevPayMode => !prevPayMode);
  };

  const getUserData = useCallback(async () => {
    console.log('refreshed');
    if (sessionPhn) {
      let {data, error} = await supabase
        .from('user')
        .select(
          'id, name,address, email, image_url, station(id, distance, station_code, station_name), phn_no, default_index, user_data(user_index, balance, verify_pin)',
        )
        .order('id')
        .eq('phn_no', sessionPhn);

      if (data) {
        setUsers(data);
      } else {
        console.log('getUserAuth', error);
      }
    }
    if (sessionMail) {
      let {data, error} = await supabase
        .from('user')
        .select(
          'id, name, address, email, image_url, station(id, distance, station_code, station_name), phn_no,default_index, user_data(user_index, balance, verify_pin)',
        )
        .order('id')
        .eq('email', sessionMail);

      if (data) {
        setUsers(data);
      } else {
        console.log('getUserAuth', error);
      }
    }
  }, [sessionPhn, sessionMail]);

  const checkAuth = async () => {
    try {
      const {data} = await supabase.auth.getSession();
 /*      console.log(data?.session?.user.email); */
      data?.session?.user.phone
        ? setSessionPhn(data?.session?.user.phone)
        : setSessionMail(data?.session?.user.email);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [getUserData, refresh]);

  useEffect(() => {
    checkAuth();
  });

  return (
    <AuthContext.Provider value={{setUsers, user, refreshModule, refresh}}>
      {children}
    </AuthContext.Provider>
  );
};

const useUserInfo = (): AuthContextType => {
  return useContext(AuthContext);
};

export {AuthProvider, useUserInfo};
