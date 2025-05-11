"use client"

import { Play, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from 'react-redux'
import { addToQueue } from "@/store/Slice/queue"
import { setSongID } from "@/store/Slice/song"
import { RootState } from '@/store/store'
import { Song } from '@/lib/types'

interface RecentSongsProps {
    songs: Song[] | undefined
}

export function RecentSongs({ songs }: RecentSongsProps) {
    const dispatch = useDispatch()
    const songID = useSelector((state: RootState) => state.songID.songID)

    return (<div className="space-y-4">
        {songs?.map((song) => (
            <div key={song.youtubeId != undefined ? song.youtubeId : song.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-accent">
                <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    width={48}
                    height={48}
                    className="rounded-md"
                />
                <div className="flex-grow">
                    <h3 className="font-semibold">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">{song.artist ? song.artist?.name : ''}</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="inline-flex" onClick={() => {
                        if (song.youtubeId != undefined ? song.youtubeId : song.id !== songID)
                            dispatch(addToQueue(song.youtubeId != undefined ? song.youtubeId : song.id))
                    }}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="inline-flex" onClick={() => {
                        dispatch(setSongID(song.youtubeId != undefined ? song.youtubeId : song.id));
                    }}>
                        <Play className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        ))}
    </div>
    )
}

