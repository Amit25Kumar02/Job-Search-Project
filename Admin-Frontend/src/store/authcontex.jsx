import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user , setUser] = useState(localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")):null)

  return (
    <AuthContext.Provider value={{ token, setToken , user , setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
