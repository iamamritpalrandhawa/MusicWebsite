"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MultiItemCarousel from "./multi-item-carousel"
import SongCard from "./SongCard"
import { useMusic } from '@/contexts/music-context'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Music, Artist, Album, Playlist, Song } from '@/lib/types'
import { useSelector, useDispatch } from 'react-redux'
import { addToQueue, clearQueue } from '@/store/Slice/queue'
import { RootState } from '@/store/store'
import { setSongID } from '@/store/Slice/song'

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queue = useSelector((state: RootState) => state.queue.queue);
    const songID = useSelector((state: RootState) => state.songID.songID);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(queue)
    }, [queue])
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q');
    useEffect(() => {
        if (!q) {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q])

    const { searchMusicByName,
        searchAlbums,
        searchArtists, searchPlaylists, getAlbumById, getPlaylistById, getArtistById } = useMusic()
    const [artists, setArtists] = useState<Artist[]>([])
    const [albums, setAlbums] = useState<Album[]>([])
    const [songs, setSongs] = useState<Music[]>([])
    const [playlist, setPlaylist] = useState<Playlist[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (q) {
                const [artists, albums, songs, playlist] = await Promise.all([
                    searchArtists(q),
                    searchAlbums(q),
                    searchMusicByName(q),
                    searchPlaylists(q)
                ])
                setArtists(artists)
                setAlbums(albums)
                setSongs(songs)
                setPlaylist(playlist)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q])



    return (
        <div className="flex-grow">
            <div className="container mx-auto py-8 px-4">
                <Tabs defaultValue="all">
                    <TabsList className=''>
                        <TabsTrigger value="all" className="px-1 min-[345px]:px-3 py-1 text-sm md:text-base">All</TabsTrigger>
                        {songs.length > 0 && (
                            <TabsTrigger value="songs" className="px-1 min-[345px]:px-3 py-1 text-sm md:text-base">Songs</TabsTrigger>
                        )}
                        {albums.length > 0 && (
                            <TabsTrigger value="albums" className="px-1 min-[345px]:px-3 py-1 text-sm md:text-base">Albums</TabsTrigger>
                        )}
                        {artists.length > 0 && (
                            <TabsTrigger value="artists" className="px-1 min-[345px]:px-3 py-1 text-sm md:text-base">Artists</TabsTrigger>
                        )}
                        {playlist.length > 0 && (
                            <TabsTrigger value="playlist" className="px-1 min-[345px]:px-3 py-1 text-sm md:text-base">Playlist</TabsTrigger>
                        )}

                    </TabsList>
                    <TabsContent value="all">
                        <div className="grid gap-6">
                            {songs.length > 0 && (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                                        Search Song Results
                                    </h2>
                                    <MultiItemCarousel
                                        items={songs.map((song) => (
                                            <SongCard
                                                key={song.youtubeId}
                                                name={song.title}
                                                artist={song.artists.map((artist) => artist.name).join(', ')}
                                                imageUrl={song.thumbnailUrl}
                                                onAddToQueue={() => {
                                                    if (songID !== song.youtubeId)
                                                        dispatch(addToQueue(song.youtubeId))
                                                }
                                                }
                                                onPlay={async () => {
                                                    dispatch(setSongID(song.youtubeId));
                                                }}
                                                onClick={() => {
                                                    navigate(`/album?id=${song.album.id}`)
                                                }}
                                            />
                                        ))}
                                    />
                                </>
                            )}
                        </div>
                        <div className="grid gap-6">
                            {albums.length > 0 && (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                                        Search Album Results
                                    </h2>
                                    <MultiItemCarousel
                                        items={albums.map((album) => (
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
                                                }
                                                }
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
                            )}
                        </div>
                        <div className="grid gap-6">
                            {artists.length > 0 && (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                                        Search Artist Results
                                    </h2>
                                    <MultiItemCarousel
                                        items={artists.map((artist) => (
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
                            )}
                        </div>
                        <div className="grid gap-6">
                            {playlist.length > 0 && (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mt-4  mb-4">
                                        Search Playlist Results
                                    </h2>
                                    <MultiItemCarousel
                                        items={playlist.map((playlist) => (
                                            <SongCard
                                                key={playlist.playlistId}
                                                name={playlist.title}
                                                artist={playlist.totalSongs}
                                                imageUrl={playlist.thumbnailUrl}
                                                onAddToQueue={async () => {
                                                    const data = await getPlaylistById(playlist.playlistId);
                                                    data.tracks.forEach((song: Album) => {
                                                        if (songID !== song.id)
                                                            dispatch(addToQueue(song.id));
                                                    });
                                                }
                                                }
                                                onPlay={async () => {
                                                    try {
                                                        const data = await getPlaylistById(playlist.playlistId);

                                                        if (data && data.tracks.length > 0) {
                                                            // Set the first song as the current song
                                                            dispatch(setSongID(data.tracks[0].id));
                                                            if (data.tracks.length > 1) dispatch(clearQueue());
                                                            // Add the rest of the songs to the queue in order
                                                            data.tracks.slice(1).forEach((song: Song) => {
                                                                if (songID !== song.id)
                                                                    dispatch(addToQueue(song.id));
                                                            });
                                                        }
                                                    } catch (error) {
                                                        console.error("Error fetching album or updating queue:", error);
                                                    }
                                                }}
                                                onClick={() => {
                                                    navigate(`/playlist?id=${playlist.playlistId}`)
                                                }}
                                            />
                                        ))}
                                    />
                                </>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="artists" className='mt-10'>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {artists.map((artist) => (
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
                        </div>
                    </TabsContent>
                    <TabsContent value="albums" className='mt-10'>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {albums.map((album) => (
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
                        </div>
                    </TabsContent>
                    <TabsContent value="songs" className='mt-10'>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {songs.map((song) => (
                                <SongCard
                                    key={song.youtubeId}
                                    name={song.title}
                                    artist={song.artists.map((artist) => artist.name).join(', ')}
                                    imageUrl={song.thumbnailUrl}
                                    onAddToQueue={() => {
                                        if (songID !== song.youtubeId)
                                            dispatch(addToQueue(song.youtubeId))
                                    }
                                    }
                                    onPlay={async () => {
                                        if (songID !== song.youtubeId)
                                            dispatch(setSongID(song.youtubeId));
                                    }}
                                    onClick={() => {
                                        navigate(`/album?id=${song.album.id}`)
                                    }}
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="playlist" className='mt-10'>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {playlist.map((playlist) => (
                                <SongCard
                                    key={playlist.playlistId}
                                    name={playlist.title}
                                    artist={playlist.totalSongs}
                                    imageUrl={playlist.thumbnailUrl}
                                    onAddToQueue={async () => {
                                        const data = await getPlaylistById(playlist.playlistId);
                                        data.tracks.forEach((song: Album) => {
                                            if (songID !== song.id)
                                                dispatch(addToQueue(song.id));
                                        });
                                    }
                                    }
                                    onPlay={async () => {
                                        try {
                                            const data = await getPlaylistById(playlist.playlistId);

                                            if (data && data.tracks.length > 0) {
                                                // Set the first song as the current song
                                                dispatch(setSongID(data.tracks[0].id));
                                                if (data.tracks.length > 1) dispatch(clearQueue());
                                                // Add the rest of the songs to the queue in order
                                                data.tracks.slice(1).forEach((song: Album) => {
                                                    if (songID !== song.id)
                                                        dispatch(addToQueue(song.id));
                                                });
                                            }
                                        } catch (error) {
                                            console.error("Error fetching album or updating queue:", error);
                                        }
                                    }}
                                    onClick={() => {
                                        navigate(`/playlist?id=${playlist.playlistId}`)
                                    }}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

    )
}
