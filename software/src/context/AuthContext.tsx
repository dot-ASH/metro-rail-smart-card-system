import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import supabase from '../data/supaBaseClient';

interface userData {
  id: number;
  user_index: number;
  name: string;
  gender: string;
  balance: number;
  token: string;
  verify_pin: string;
}
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: userData[];
  setUsers: (users: userData[]) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: [],
  setUsers: () => {},
  token: null,
  setToken: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUsers] = useState<userData[]>([]);

  // You can use `useEffect` here to check for an existing token in storage or do any other initialization
  const getUserData = async () => {
    let {data, error} = await supabase
      .from('user')
      .select('id, user_index, name, gender, balance, token, verify_pin')
      .eq('id', 1);

    if (data) {
      setUsers(data);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user[0]?.token) {
      setToken(user[0]?.token);
    } else {
      setToken(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{token, setUsers, setToken, user}}>
      {children}
    </AuthContext.Provider>
  );
};

const useUserInfo = (): AuthContextType => {
  return useContext(AuthContext);
};

export {AuthProvider, useUserInfo};
