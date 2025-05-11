"use client"

import { Plus, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { Album, Song } from '@/lib/types'
import { useDispatch, useSelector } from 'react-redux'
import { addToQueue } from "@/store/Slice/queue"
import { setSongID } from "@/store/Slice/song"
import { RootState } from '@/store/store'


interface SongListProps {
    songs: Album[] | Song[] | undefined
}

export function SongList({ songs }: SongListProps) {
    const dispatch = useDispatch()
    const songID = useSelector((state: RootState) => state.songID.songID);

    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Artist</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Duration</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-muted">
                        {songs?.map((song, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{song.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">{song.duration != undefined ? song.duration.label : song.durationStr}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end">
                                        <Button variant="ghost" size="sm" className="inline-flex" onClick={() => {
                                            if (song.youtubeId != undefined ? song.youtubeId : song.id !== songID)
                                                dispatch(addToQueue(song.youtubeId != undefined ? song.youtubeId : song.id))
                                        }}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="inline-flex" onClick={() => {
                                            dispatch(setSongID(song.youtubeId != undefined ? song.youtubeId : song.id));
                                        }
                                        }>
                                            <Play className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

