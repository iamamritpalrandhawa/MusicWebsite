"use client"

import { Play, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react'

interface ArtistCardProps {
    name: string
    artist: string | undefined
    imageUrl: string
    onAddToQueue: () => void
    onClick: () => void
    onPlay: () => void
}

export default function SongCard({ name, artist, imageUrl, onAddToQueue, onClick, onPlay }: ArtistCardProps) {
    const { toast } = useToast()

    const addToQueue = () => {
        onAddToQueue()
        toast({
            title: "Added to Queue",
            description: `${name}'s top song has been added to the queue.`,
        })
    }
    const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

    const handleError = () => {
        setCurrentImageUrl('https://placehold.co/600x400?text=Song+Image');
    };


    return (
        <Card className="group overflow-hidden   h-[300px]  cursor-pointer" onClick={onClick}>
            <CardContent className="p-0 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden flex-grow">
                    <img
                        src={currentImageUrl}
                        alt={name}
                        className="object-cover w-full h-[230px] transition-transform group-hover:scale-105"
                        onError={handleError}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full mr-2"
                            onClick={(event) => {
                                event.stopPropagation();
                                onPlay();
                            }}
                        >
                            <Play className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full"
                            onClick={(event) => {
                                event.stopPropagation();
                                addToQueue();
                            }}
                        >
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="p-2 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {typeof artist === "number" ? `Songs: ${artist}` : artist}
                    </p>
                </div>
            </CardContent>
        </Card>

    )
}

