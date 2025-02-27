import { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export const useGetAuthUser = () => {
  const { state, dispatch } = useAuth();
  const { user, token } = state;
  const [authUser, setAuthUser] = useState<any | null>(user || null);
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded?.userId;

        if (!userId) {
          console.error("Invalid token: Missing userId");
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }

        // Fetch user from API
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

          // Store user in localStorage
          localStorage.setItem("user", JSON.stringify(userData.user));
          dispatch({ type: "LOGIN", payload: { token, user: userData.user } });
        } else {
          console.error("Failed to fetch user data");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error decoding token or fetching user data", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        router.push("/auth/login");
      }
    };

 
      fetchUser();
   
  }, [token, dispatch, router]);

  return authUser;
};
