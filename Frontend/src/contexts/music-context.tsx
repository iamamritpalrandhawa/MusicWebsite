/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext } from "react";

interface MusicContextType {
    getMusicById: (id: string) => Promise<any>;
    searchMusicByName: (name: string) => Promise<any>;
    searchAlbums: (name: string) => Promise<any>;
    getAlbumById: (id: string) => Promise<any>;
    searchArtists: (name: string) => Promise<any>;
    getArtistById: (id: string) => Promise<any>;
    searchPlaylists: (name: string) => Promise<any>;
    getPlaylistById: (id: string) => Promise<any>;
    getPlaylistSongsById: (id: string) => Promise<any>;
    getSuggestions: (musicId: string) => Promise<any>;
    getNewReleases: () => Promise<any>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const API_BASE_URL = "https://sound-scribe.vercel.app/songs";

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const apiCall = async (endpoint: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return await response.json();
        } catch (error) {
            console.error("API call error:", error);
            throw error;
        }
    };

    const getMusicById = async (id: string) => {
        return apiCall(`/id/${id}`);
    };

    const searchMusicByName = async (name: string) => {
        return apiCall(`/name/${name}`);
    };

    const searchAlbums = async (name: string) => {
        return apiCall(`/getalbums/${name}`);
    };

    const getAlbumById = async (id: string) => {
        return apiCall(`/albumid/${id}`);
    };

    const searchArtists = async (name: string) => {
        return apiCall(`/getartist/${name}`);
    };

    const getArtistById = async (id: string) => {
        return apiCall(`/artistid/${id}`);
    };

    const searchPlaylists = async (name: string) => {
        return apiCall(`/getplaylist/${name}`);
    };

    const getPlaylistSongsById = async (id: string) => {
        return apiCall(`/playlistsongsid/${id}`);
    };

    const getPlaylistById = async (id: string) => {
        return apiCall(`/playlistid/${id}`);
    }

    const getSuggestions = async (musicId: string) => {
        return apiCall(`/suggestions/${musicId}`);
    };

    const getNewReleases = async () => {
        return apiCall("/trending");
    }



    return (
        <MusicContext.Provider
            value={{
                getMusicById,
                searchMusicByName,
                searchAlbums,
                getAlbumById,
                searchArtists,
                getArtistById,
                searchPlaylists,
                getPlaylistSongsById,
                getSuggestions,
                getNewReleases,
                getPlaylistById
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic(): MusicContextType {
    const context = useContext(MusicContext);

    if (!context) {
        throw new Error("useMusic must be used within a MusicProvider");
    }

    return context;
}
