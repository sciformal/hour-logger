import { useContext, createContext } from "react";

export const AuthenticationContext = createContext(null);
export const UserContext = createContext(null);

export function UserProvider() {

}
export function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}

export function useUserContext() {
  return useContext(UserContext);
}