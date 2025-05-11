"use client"

import { useEffect, useState } from "react"
// import { useToast } from "@/hooks/use-toast"
import { SongList } from "@/components/song-list"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'
import { useLocation } from "react-router-dom"
import { useMusic } from "@/contexts/music-context"
import type { Playlist, Song } from '@/lib/types'
import { useDispatch, useSelector } from 'react-redux'
import { addToQueue, clearQueue } from '@/store/Slice/queue'
import { setSongID } from '@/store/Slice/song'
import { RootState } from "@/store/store"

export default function PlaylistPage() {
    // const { toast } = useToast()
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const id: string | null = queryParams.get('id');

    const songID = useSelector((state: RootState) => state.songID.songID);
    const { getPlaylistById } = useMusic();
    const [result, setResult] = useState<Playlist>();

    useEffect(() => {
        if (!id) return;
        const fetchMusic = async () => {
            const data = await getPlaylistById(id);
            setResult(data);
        };
        fetchMusic();
    }, [id]);

    const [currentImageUrl, setCurrentImageUrl] = useState(result?.thumbnailUrl);

    useEffect(() => {
        setCurrentImageUrl(result?.thumbnailUrl);
    }, [result]);

    const handleError = () => {
        setCurrentImageUrl('https://placehold.co/600x400?text=Song+Image');
    };

    return (
        <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-4 md:mb-8 space-y-4 md:space-y-0 md:space-x-8">
                    <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center">
                        <img
                            alt={result?.title}
                            width={300}
                            height={300}
                            className="rounded-lg shadow-lg w-full max-w-[300px] h-auto"
                            src={currentImageUrl}
                            onError={handleError}
                        />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{result?.title}</h1>
                        <p className="text-sm text-muted-foreground mb-4">{result?.tracks.length} songs • {result?.durationStr} </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Button onClick={() => {
                                try {
                                    if (result?.tracks && result?.tracks.length > 0) {
                                        // Set the first song as the current song
                                        dispatch(setSongID(result?.tracks[0].id));
                                        if (result?.tracks.length > 1) dispatch(clearQueue());
                                        // Add the rest of the songs to the queue in order
                                        result?.tracks.slice(1).forEach((song: Song) => {
                                            if (songID !== song.id)
                                                dispatch(addToQueue(song.id));
                                        });
                                    }
                                } catch (error) {
                                    console.error("Error fetching album or updating queue:", error);
                                }
                            }} size="lg" className="bg-white text-black hover:bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200">
                                <Play className="mr-2 h-4 w-4 " /> Play All
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => {
                                result?.tracks.forEach((song) => {
                                    if (songID !== song.id)
                                        dispatch(addToQueue(song.id));
                                });
                            }}>
                                Add All to Queue
                            </Button>
                        </div>
                    </div>
                </div>
                <SongList songs={result?.tracks} />
            </div>
        </div>
    )
}


