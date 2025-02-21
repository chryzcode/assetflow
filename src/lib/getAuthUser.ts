import { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";
import {jwtDecode} from "jwt-decode";


export const getAuthUser = () => {
    const { state } = useAuth();
    const { user } = state;
    const [authUser, setAuthUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
          const token = localStorage.getItem("token");
          if (!token) return;
    
          try {
            // Decode the token to extract userId
            const decoded: any = jwtDecode(token);
            const userId = decoded?.userId;
    
            if (!userId) {
              console.error("Invalid token: Missing userId");
              return;
            }
    
            // Fetch user by userId
            const response = await fetch(`/api/user/detail?userId=${userId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setAuthUser(userData.user);
            } else {
              console.error("Failed to fetch user data");
            }
          } catch (error) {
            console.error("Error decoding token or fetching user data", error);
          }
        };

        fetchUser();
    }, [ user ]);

    return authUser;
};


