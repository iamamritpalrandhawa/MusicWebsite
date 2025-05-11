"use client"

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useMusic } from '@/contexts/music-context'
import { removeFromQueue } from '@/store/Slice/queue'
import { useEffect, useState } from 'react'
import { Song } from '@/lib/types'


interface QueueModalProps {
    isOpen: boolean
    onClose: () => void
}

export function QueueModal({ isOpen, onClose }: QueueModalProps) {
    const { getMusicById } = useMusic()
    const queueID = useSelector((state: RootState) => state.queue.queue);
    const dispatch = useDispatch()
    // Local state to store song details and fetched IDs
    const [fetchedSongs, setFetchedSongs] = useState<(Song & { id: string })[]>([]);
    const [fetchedIds, setFetchedIds] = useState<Set<string>>(new Set());
    useEffect(() => {
        // Find IDs that have not been fetched yet
        const newIds = queueID.filter((id) => !fetchedIds.has(id));

        if (newIds.length > 0) {
            const fetchDetails = async () => {
                const newSongs = await Promise.all(
                    newIds.map(async (id) => {
                        const song = await getMusicById(id);
                        return { id, ...song };
                    })
                );

                setFetchedSongs((prevSongs: (Song & { id: string })[]) => {
                    const songMap: Map<string, Song & { id: string }> = new Map(
                        prevSongs.map((song) => [song.id, song])
                    );

                    // Add new songs to the map
                    newSongs.forEach((song) => songMap.set(song.id, song));

                    // Reconstruct the song array based on the order of `queueID`
                    return queueID
                        .map((id) => songMap.get(id))
                        .filter((song): song is Song & { id: string } => Boolean(song));
                });

                // Update fetchedIds with the newly added IDs
                setFetchedIds((prevIds) => {
                    const updatedIds = new Set(prevIds);
                    newIds.forEach((id) => updatedIds.add(id));
                    return updatedIds;
                });
            };

            fetchDetails();
        }

        // Remove songs and IDs that are no longer in `queueID`
        setFetchedSongs((prevSongs) =>
            prevSongs.filter((song) => {
                if (!queueID.includes(song.id)) {
                    setFetchedIds((prevIds) => {
                        const updatedIds = new Set(prevIds);
                        updatedIds.delete(song.id); // Remove missing ID
                        return updatedIds;
                    });
                    return false; // Exclude song from fetchedSongs
                }
                return true; // Keep song if still in queueID
            })
        );
    }, [queueID, fetchedIds, getMusicById]);



    const handleRemoveItem = (id: string) => () => {
        setFetchedSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
        setFetchedIds((prevIds) => {
            const updatedIds = new Set(prevIds);
            updatedIds.delete(id);
            return updatedIds;
        });
        dispatch(removeFromQueue(id))
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="w-[300px] md:w-[425px] rounded-lg p-5">
                <DialogHeader>
                    <DialogTitle>Queue</DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[60vh]">
                    {fetchedSongs.length === 0 ? (
                        <p className="text-center text-muted-foreground">Your queue is empty</p>
                    ) : (
                        <ul className="space-y-2">
                            {fetchedSongs.map((item) => (
                                <li key={item.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-accent">
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        width={48}
                                        height={48}
                                        className="rounded-md"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.artist.name}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleRemoveItem(item.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

