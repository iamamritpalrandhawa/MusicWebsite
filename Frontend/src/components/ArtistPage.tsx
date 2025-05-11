"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMusic } from "@/contexts/music-context"
import type { Album, Artist, Song } from '@/lib/types'
import MultiItemCarousel from "./multi-item-carousel"
import SongCard from "./SongCard"
import { useDispatch, useSelector } from "react-redux"
import { addToQueue, clearQueue } from "@/store/Slice/queue"
import { setSongID } from "@/store/Slice/song"
import { RootState } from "@/store/store"

export default function ArtistPage() {
    const navigate = useNavigate()
    // const { toast } = useToast()
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const id: string | null = queryParams.get('id');
    const { getArtistById, searchArtists, getAlbumById } = useMusic();
    const songID = useSelector((state: RootState) => state.songID.songID);
    const [result, setResult] = useState<Artist>();

    useEffect(() => {
        if (!id) return;
        const fetchMusic = async () => {
            const data = await getArtistById(id);
            console.log(data);
            const artistData = await searchArtists(data.name);
            setCurrentImageUrl(artistData[0].thumbnailUrl);
            setResult(data);

        };
        fetchMusic();
    }, [id]);


    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const handleError = () => {
        setCurrentImageUrl('https://placehold.co/600x400?text=Song+Image');
    };

    return (
        <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-4 md:mb-8 space-y-4 md:space-y-0 md:space-x-8">
                    <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center">
                        <img
                            alt={result?.name}
                            width={300}
                            height={300}
                            className="rounded-lg shadow-lg w-full max-w-[300px] h-auto"
                            src={currentImageUrl}
                            onError={handleError}
                        />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{result?.name}</h1>
                        <p className="text-md text-muted-foreground mb-4">
                            {result?.description?.split(' ').map((word, index) => {
                                // Check if the word is a link enclosed in parentheses
                                const linkMatch = word.match(/\((https?:\/\/[^\s]+)\)/);
                                if (linkMatch) {
                                    return (
                                        <a
                                            key={index}
                                            href={linkMatch[1]} // Extract the link from the match
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {linkMatch[1]}
                                        </a>
                                    );
                                }
                                return word + ' '; // Return the word with a space
                            })}
                        </p>

                        <p className="text-sm text-muted-foreground mb-4"> {result?.subscribers} subscribers</p>
                    </div>
                </div>
                <>
                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                        Albums
                    </h2>
                    <MultiItemCarousel
                        items={result?.albums?.map((album: Album) => (
                            <SongCard
                                key={album.albumId}
                                name={album.title}
                                artist={album.artist}
                                imageUrl={album.thumbnailUrl}
                                onAddToQueue={async () => {
                                    const data = await getAlbumById(album.albumId);
                                    data.forEach((song: Album) => {
                                        if (songID !== song.youtubeId)
                                            dispatch(addToQueue(song.youtubeId))
                                    })
                                }}
                                onPlay={async () => {
                                    try {
                                        const data = await getAlbumById(album.albumId);

                                        if (data && data.length > 0) {
                                            // Set the first song as the current song
                                            dispatch(setSongID(data[0].youtubeId));
                                            if (data.length > 1) dispatch(clearQueue());
                                            // Add the rest of the songs to the queue in order
                                            data.slice(1).forEach((song: Album) => {
                                                if (songID !== song.youtubeId)
                                                    dispatch(addToQueue(song.youtubeId));
                                            });
                                        }
                                    } catch (error) {
                                        console.error("Error fetching album or updating queue:", error);
                                    }
                                }}
                                onClick={() => {
                                    navigate(`/album?id=${album.albumId}`)
                                }}
                            />
                        ))}
                    />
                </>
                <>
                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                        Songs
                    </h2>
                    <MultiItemCarousel
                        items={[
                            ...(result?.singles || []).map((song) => (
                                <SongCard
                                    key={song.albumId}
                                    name={song.title}
                                    artist={result?.name}
                                    imageUrl={song.thumbnailUrl}
                                    onAddToQueue={async () => {
                                        const data = await getAlbumById(song.albumId);
                                        data.forEach((song: Album) => {
                                            if (songID !== song.youtubeId)
                                                dispatch(addToQueue(song.youtubeId))
                                        })
                                    }}
                                    onPlay={async () => {
                                        try {
                                            const data = await getAlbumById(song.albumId);

                                            if (data && data.length > 0) {
                                                // Set the first song as the current song
                                                dispatch(setSongID(data[0].youtubeId));
                                                if (data.length > 1) dispatch(clearQueue());
                                                // Add the rest of the songs to the queue in order
                                                data.slice(1).forEach((song: Album) => {
                                                    if (songID !== song.youtubeId)
                                                        dispatch(addToQueue(song.youtubeId));
                                                });
                                            }
                                        } catch (error) {
                                            console.error("Error fetching album or updating queue:", error);
                                        }
                                    }}
                                    onClick={() => {
                                        navigate(`/album?id=${song.albumId}`);
                                    }}
                                />
                            )),
                            ...(result?.songs || []).map((song: Song) => (
                                <SongCard
                                    key={song.id}
                                    name={song.title}
                                    artist={
                                        song.artist
                                            ? song.artist.name
                                            : song.artists?.map((artist) => artist.name).join(', ')
                                    }
                                    imageUrl={song.thumbnailUrl}
                                    onAddToQueue={() => {
                                        if (songID !== song.id)
                                            dispatch(addToQueue(song.id))
                                    }
                                    }
                                    onPlay={() => {
                                        dispatch(setSongID(song.id));
                                    }}
                                    onClick={() => {
                                        navigate(`/album?id=${song.album?.id}`);
                                    }}
                                />
                            ))
                        ]}
                    />

                </>
                <>
                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                        Suggested Artists
                    </h2>
                    <MultiItemCarousel
                        items={result?.suggestedArtists?.map((artist) => (
                            <SongCard
                                key={artist.artistId}
                                name={artist.name}
                                artist={artist.subscribers}
                                imageUrl={artist.thumbnailUrl}
                                onAddToQueue={async () => {
                                    const data: Artist = await getArtistById(artist.artistId);
                                    data?.songs?.forEach((song: Song) => {
                                        if (songID !== song.id)
                                            dispatch(addToQueue(song.id))
                                    })
                                }
                                }
                                onPlay={async () => {
                                    try {
                                        const { songs }: Artist = await getArtistById(artist.artistId);

                                        if (songs && songs.length > 0) {
                                            // Set the first song as the current song
                                            dispatch(setSongID(songs[0].id));
                                            if (songs.length > 1) dispatch(clearQueue());
                                            // Add the rest of the songs to the queue in order
                                            songs.slice(1).forEach((song: Song) => {
                                                if (songID !== song.id)
                                                    dispatch(addToQueue(song.id));
                                            });
                                        }
                                    } catch (error) {
                                        console.error("Error fetching album or updating queue:", error);
                                    }
                                }}
                                onClick={() => {
                                    navigate(`/artist?id=${artist.artistId}`)
                                }}
                            />
                        ))}
                    />
                </>
            </div>
        </div>
    )
}
