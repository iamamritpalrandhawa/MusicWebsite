"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
    id: string;
    username: string;

}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (email: string, username: string, password: string) => Promise<void>;
    updateUsername: (newUsername: string) => Promise<void>;
    checkUsername: (username: string) => Promise<boolean>;
    updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    fetchUser: () => Promise<void>;
    setRecentSongs: React.Dispatch<React.SetStateAction<string[]>>;

    recentSongs: string[] | undefined;
    addRecent: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [recentSongs, setRecentSongs] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [hasToken] = useState(!!localStorage.getItem("token"));
    const url = "https://sound-scribe.vercel.app/";
    useEffect(() => {
        if (hasToken) {
            fetchUser();
        }
    }, [hasToken]);

    const login = async (username: string, password: string): Promise<void> => {
        try {
            const response = await fetch(`${url}auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: username, password }),
            });

            const json = await response.json();

            if (response.ok) {
                localStorage.setItem("token", json.authtoken);
                await fetchUser();
                return json;
            } else {
                return json.error;
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    const signup = async (email: string, username: string, password: string): Promise<void> => {
        try {
            const response = await fetch(`${url}auth/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });

            const json = await response.json();

            if (response.ok) {
                localStorage.setItem("token", json.authtoken);
                await fetchUser();
                return json;
            } else {
                return json.error;
            }
        } catch (error) {
            console.error("Error during signup:", error);
            throw error;
        }
    };

    const fetchUser = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}auth/getuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || "",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const json: User = await response.json();
            setUser(json);
            fetchRecent();
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        }
    };

    const updateUsername = async (newUsername: string): Promise<void> => {
        try {
            const response = await fetch(`${url}auth/updateusername`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || "",
                },
                body: JSON.stringify({ username: newUsername }),
            });

            const json = await response.json();

            if (response.ok) {
                await fetchUser();
                return json;
            } else {
                return json.errors[0];
            }
        } catch (error) {
            console.error("Error updating username:", error);
            throw error;
        }
    };

    const checkUsername = async (username: string): Promise<boolean> => {
        try {
            const response = await fetch(`${url}auth/checkusername/${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await response.json();

            return response.ok && json.available;
        } catch (error) {
            console.error("Error checking username:", error);
            throw error;
        }
    };

    const updatePassword = async (oldpassword: string, newpassword: string): Promise<void> => {
        try {
            const response = await fetch(`${url}auth/updatepassword`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || "",
                },
                body: JSON.stringify({ oldpassword, newpassword }),
            });

            const json = await response.json();

            if (response.ok) {
                return json;
            } else {
                return json.errors[0];
            }
        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }

    const addRecent = async (id: string): Promise<void> => {
        try {
            const response = await fetch(`${url}recentplayed/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || "",
                },
                body: JSON.stringify({ id }),
            });


            if (response.ok) {
                await fetchUser();
            }
        }
        catch (error) {
            console.error("Error adding recent:", error);
        }
    }

    const fetchRecent = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}recentplayed/getrecents`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || "",
                },
            });
            const json = await response.json();

            if (response.ok) {
                setRecentSongs(json);
            }
        }
        catch (error) {
            console.error("Error fetching recent:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, updateUsername, checkUsername, fetchUser, updatePassword, addRecent, setRecentSongs, recentSongs }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
