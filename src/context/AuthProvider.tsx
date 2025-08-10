// import { useState, useEffect, createContext, ReactNode, PropsWithChildren, useMemo } from "react";
// import AuthService from "../services/authService";

// interface User {
//   id: number;
//   username: string;
// }

// export interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// export const AuthProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const authenticatedUser = await AuthService.getUser();
//         setUser(authenticatedUser);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (username: string, password: string) => {
//     setLoading(true);
//     try {
//       await AuthService.login(username, password);
//       const authenticatedUser = await AuthService.getUser();
//       setUser(authenticatedUser);
//     } catch (error) {
//       console.error("Erro ao fazer login:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     try {
//       await AuthService.logout();
//       setUser(null);
//     } catch (error) {
//       console.error("Erro ao fazer logout:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated: !!user,
//       login,
//       logout,
//       loading,
//     }),
//     [user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
