/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ThemeToggglebutton from "@/components/ui/theme-togggle"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { Music } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMusic } from "@/contexts/music-context";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { setQuery } from "@/store/Slice/query";
import type { RootState } from "@/store/store";
import { useLocation } from "react-router-dom";
import type { ArtistInfo, SearchResult } from "@/lib/types";



function AuthButtons() {
    const { user, logout } = useAuth()
    if (user) {
        return (

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Link to="/profile">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full p-2 transition hover:bg-muted hover:shadow-md"
                            aria-label="User Profile"
                        >
                            <Avatar className="w-10 h-10 border-2 border-accent">
                                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                <AvatarFallback className="text-sm font-medium text-primary">{(() => {
                                    const parts = user.username.split(" ");
                                    const firstInitial = parts[0]?.[0]?.toUpperCase() || "";
                                    const secondInitial = parts[1]?.[0]?.toUpperCase() || "";
                                    return firstInitial + secondInitial;
                                })()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>

                    </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link to="/profile">
                        <DropdownMenuItem >
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => { logout() }}>
                        Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <>
            <Link to="/login">
                <Button variant="outline">
                    Login
                </Button>
            </Link>
            <Link to="/signup">
                <Button variant="outline">
                    Sign Up
                </Button>
            </Link>
        </>
    )
}



export default function Navbar() {
    const [results, setResults] = useState<SearchResult[]>([])
    const { searchMusicByName } = useMusic()
    const navigate = useNavigate()
    const query = useSelector((state: RootState) => state.query.query)
    const dispatch = useDispatch()
    const { pathname } = useLocation()


    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setQuery(value))
        if (pathname !== '/') return;

        if (value.trim()) {
            try {
                // Fetch search results using your searchMusicByName function
                const searchResults = await searchMusicByName(value);

                // Transform the search results into the desired structure
                const formattedResults: SearchResult[] = searchResults.map((result: SearchResult) => ({
                    id: result.youtubeId,
                    name: result.title,
                    type: result.album ? 'album' : 'song',
                    imageUrl: result.thumbnailUrl || 'https://placehold.co/10x10',
                    duration: {
                        label: result.duration,
                        totalSeconds: result.durationInSeconds,
                    },
                    album: result.album ? { id: result.album.id, name: result.album.name } : undefined,
                    artists: result.artists?.map((artist: ArtistInfo) => ({ id: artist.id, name: artist.name })),
                }));

                setResults(() => formattedResults);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setResults([]);
            }
        } else {
            setResults(() => []);
        }
    };

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]); // Clear results when the query is empty
        }
    }, [query]);


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Clean up on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex items-center w-full border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 md:px-6 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <header className=" w-full flex items-center justify-between h-14 gap-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2 font-semibold" >
                        <Link to="/" className="flex items-center space-x-2">
                            <Music className="h-6 w-6" />
                            <span className="font-bold hidden sm:inline-block">Music App</span>
                        </Link>
                    </div>
                    <div className={`relative flex-1 max-w-md ${(windowWidth > 480 || useAuth().user) ? 'block' : 'hidden'}`}>
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" onClick={() => {
                            if (query.trim()) {
                                navigate('/search?q=' + encodeURIComponent(query));
                            }
                        }} />
                        <Input type="search" placeholder="Search music..." className="pl-8 rounded-full w-full" onChange={handleInputChange} onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.trim()) {
                                e.preventDefault();
                                navigate('/search?q=' + encodeURIComponent(query));
                            }
                        }} />
                        {pathname === '/' && query.trim() && results.length > 0 && (
                            <div
                                className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg"
                                style={{
                                    maxHeight: '200px',
                                    overflowY: results.length > 5 ? 'auto' : 'hidden',
                                }}
                            >
                                {results.map((result) => (
                                    <Link
                                        key={result.id}
                                        to={`/album?id=${result.album?.id}`}
                                        className="flex items-center p-2 hover:bg-accent"
                                    >
                                        <img src={result.imageUrl} alt={result.name} className="w-8 h-8 mr-2 rounded" />
                                        <div>
                                            <p className="font-semibold">{result.name}</p>
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {result.artists && result.artists.length > 0
                                                    ? result.artists.map((artist) => artist.name).join(', ')
                                                    : result.type}
                                            </p>

                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggglebutton />
                        <AuthButtons />
                    </div>
                </header>
                <div className={`relative flex-1 max-w-md mb-2 ${(windowWidth > 480 || useAuth().user) ? 'hidden' : 'block'}`}>
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" onClick={() => {
                        if (query.trim()) {
                            navigate('/search?q=' + encodeURIComponent(query));
                        }
                    }} />
                    <Input type="search" placeholder="Search music..." className="pl-8 rounded-full w-full" onChange={handleInputChange} onKeyDown={(e) => {
                        if (e.key === 'Enter' && query.trim()) {
                            e.preventDefault();
                            navigate('/search?q=' + encodeURIComponent(query));
                        }
                    }} />
                    {pathname === '/' && query.trim() && results.length > 0 && (
                        <div
                            className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg"
                            style={{
                                maxHeight: '200px',
                                overflowY: results.length > 5 ? 'auto' : 'hidden',
                            }}
                        >
                            {results.map((result) => (
                                <Link
                                    key={result.id}
                                    to={`/album?id=${result.album?.id}`}
                                    className="flex items-center p-2 hover:bg-accent"
                                >
                                    <img src={result.imageUrl} alt={result.name} className="w-8 h-8 mr-2 rounded" />
                                    <div>
                                        <p className="font-semibold">{result.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {result.artists && result.artists.length > 0
                                                ? result.artists.map((artist) => artist.name).join(', ')
                                                : result.type}
                                        </p>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </div>



        </div>
    )
}


function Search(props: { className: string, onClick: () => void }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={props.onClick}
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}