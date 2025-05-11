"use client"

import { useEffect, useState } from "react"
import { SongList } from "@/components/song-list"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'
import { useLocation } from "react-router-dom"
import { useMusic } from "@/contexts/music-context"
import type { Album } from '@/lib/types'
import { useDispatch, useSelector } from 'react-redux'
import { addToQueue, clearQueue } from '@/store/Slice/queue'
import { setSongID } from '@/store/Slice/song'
import { RootState } from "@/store/store"

export default function AlbumPage() {
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const songID = useSelector((state: RootState) => state.songID.songID);
    const id: string | null = queryParams.get('id');
    const { searchAlbums, getAlbumById } = useMusic();
    const [result, setResult] = useState<Album[]>([]);
    const [songs, setSongs] = useState<Album>();

    useEffect(() => {
        if (!id) return;
        const fetchMusic = async () => {
            const data = await getAlbumById(id);
            setResult(data);
            const songData = await searchAlbums(data[0].album);
            let albumData = songData.find((song: Album) => song.albumId === id);
            if (!albumData) albumData = songData[0];
            setSongs(albumData);
        };
        fetchMusic();
    }, [id]);

    const [currentImageUrl, setCurrentImageUrl] = useState(songs?.thumbnailUrl);

    useEffect(() => {
        setCurrentImageUrl(songs?.thumbnailUrl);
    }, [songs]);

    const handleError = () => {
        setCurrentImageUrl('https://placehold.co/600x400?text=Song+Image');
    };

    return (
        <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-4 md:mb-8 space-y-4 md:space-y-0 md:space-x-8">
                    <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center">
                        <img
                            alt={songs?.title}
                            width={300}
                            height={300}
                            className="rounded-lg shadow-lg w-full max-w-[300px] h-auto"
                            src={currentImageUrl}
                            onError={handleError}
                        />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{songs?.title}</h1>
                        <p className="text-xl text-muted-foreground mb-4">{songs?.artist}</p>
                        <p className="text-sm text-muted-foreground mb-4">{result?.length} songs • {calculateTotalDuration(result)} </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200"
                                onClick={() => {
                                    try {
                                        if (result && result.length > 0) {
                                            // Set the first song as the current song
                                            dispatch(setSongID(result[0].youtubeId));
                                            if (result.length > 1) dispatch(clearQueue());
                                            // Add the rest of the songs to the queue in order
                                            result.slice(1).forEach((song: Album) => {
                                                if (songID !== song.youtubeId)
                                                    dispatch(addToQueue(song.youtubeId));
                                            });
                                        }
                                    } catch (error) {
                                        console.error("Error fetching album or updating queue:", error);
                                    }
                                }}>
                                <Play className="mr-2 h-4 w-4 " /> Play All
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => {
                                result.forEach((song) => {
                                    if (songID !== song.youtubeId)
                                        dispatch(addToQueue(song.youtubeId));
                                });
                            }}>
                                Add All to Queue
                            </Button>
                        </div>
                    </div>
                </div>
                <SongList songs={result} />
            </div>
        </div>
    )
}
//
function calculateTotalDuration(songs: Album[]): string {
    const totalSeconds = songs.reduce((acc, song) => {
        const [minutes, seconds] = song.duration.label.split(':').map(Number);
        return acc + minutes * 60 + seconds;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours} hr ${minutes} min`;
    } else {
        return `${minutes} min`;
    }
}
