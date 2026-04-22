import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest } from "../api/auth";
import { loginRequest } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);


  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      } else if (error.response.data.message) {
        setErrors(error.response.data.message);
      } else {
        setErrors(["Error desconocido"]);
      }
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      setUser(res.data);
    

      setIsAuthenticated(true);
    } catch (error) {
       console.log(error.response);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      } else if (error.response.data.message) {
        return setErrors([error.response.data.message]);
      }  else {
        setErrors(["Error desconocido"]);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
        const timer = setTimeout(() => {
            setErrors([]);
        }, 5000);   
    return () => clearTimeout(timer)
    
    }
}, [errors]);



  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
