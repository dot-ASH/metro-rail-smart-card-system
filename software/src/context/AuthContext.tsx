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

interface userData {
  name: string;
  gender: string;
  phn_no: userSecureData[];
}
interface AuthContextType {
  user: userData[];
  setUsers: (users: userData[]) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: [],
  setUsers: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUsers] = useState<userData[]>([]);
  const [sessionPhn, setSessionPhn] = useState<String | undefined>();

  const getUserData = useCallback(async () => {
    if (sessionPhn) {
      let {data, error} = await supabase
        .from('user')
        .select('name, gender, phn_no(user_index, balance, verify_pin)')
        .eq('phn_no', sessionPhn);

      if (data) {
        setUsers(data);
        console.log(data);
      } else {
        console.log(error);
      }
    }
  }, [sessionPhn]);

  const checkAuth = async () => {
    try {
      const {data} = await supabase.auth.getSession();
      console.log(data?.session?.user.phone);
      setSessionPhn(data?.session?.user.phone);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{setUsers, user}}>
      {children}
    </AuthContext.Provider>
  );
};

const useUserInfo = (): AuthContextType => {
  return useContext(AuthContext);
};

export {AuthProvider, useUserInfo};
