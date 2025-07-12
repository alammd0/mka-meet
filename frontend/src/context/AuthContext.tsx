import { createContext, useEffect, useState, type ReactNode } from "react";
import { useContext } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

const initialState: User = {
  id: 0,
  name: "",
  email: "",
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

export const useAuth = () => useContext(AuthContext);

const AuthContextProvider = ({ children }: StateProps) => {
  const [user, setUser] = useState<User>(initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (token && id && name && email) {
      setUser({ id: Number(id), name, email, token });
    }
  }, []);

  const login = (user: User) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("userId", String(user.id));
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    setUser(user);
  };

  const logout = () => {
    setUser(initialState);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
