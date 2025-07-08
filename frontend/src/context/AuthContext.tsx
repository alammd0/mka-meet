import { createContext, useState, type ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
}

const initialState: User = {
  id: 0,
  name: "",
  email: "",
  password: "",
  token: "",
};

interface AuthContextType {
  user: User;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

type StateProps = {
  children: ReactNode;
};

const AuthContextProvider = ({ children }: StateProps) => {
  const [user, setUser] = useState<User>(initialState);

  const login = (user: User) => {
    localStorage.setItem("token", user.token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(initialState);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
