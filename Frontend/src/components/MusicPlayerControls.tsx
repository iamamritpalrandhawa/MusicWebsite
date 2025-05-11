"use client"

import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, FastForward, Rewind } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { QueueModal } from "./queue-modal"
import { useController } from "@/contexts/controller-context"
import { useState } from "react"

export function MusicPlayerControls() {
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const { songDetails, seekTo, playerDetails, formatTime, isPlaying, play, previous, next, setVolume, progress } = useController();
    const { currentTime, duration, volume } = playerDetails;

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center py-4 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-1/3">
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <img
                                    src={songDetails?.thumbnailUrl || "https://placehold.co/600x400?text=Song+Image"}
                                    alt="Album art"
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold truncate">{songDetails?.title || "Song Title"}</h3>
                                <p className="text-sm text-muted-foreground truncate"> {songDetails?.artist?.name || "Artist Name"}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 w-full sm:w-1/3">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="inline-flex" onClick={() => seekTo(Math.max(0, currentTime - 10))}>
                                    <Rewind className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={previous}>
                                    <SkipBack className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={play}
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-10 w-10"
                                >
                                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={next}>
                                    <SkipForward className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="sm:inline-flex" onClick={() => seekTo(Math.min(duration, currentTime + 10))}>
                                    <FastForward className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 w-full max-w-md">
                                <span className="text-sm text-muted-foreground sm:inline">{formatTime(currentTime)}</span>
                                <Slider
                                    value={[progress]}
                                    max={100}
                                    step={1}
                                    className="w-full cursor-pointer"
                                    onValueChange={([newProgress]) => seekTo((duration / 100) * newProgress)}
                                />
                                <span className="text-sm text-muted-foreground sm:inline">{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-1/3 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => setIsQueueOpen(true)}>
                                <ListMusic className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <Volume2 className="h-5 w-5" />
                                <Slider
                                    value={[volume]}
                                    max={100}
                                    step={1}
                                    className="w-32 cursor-pointer"
                                    onValueChange={([newVolume]) => setVolume(newVolume)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <QueueModal
                isOpen={isQueueOpen}
                onClose={() => setIsQueueOpen(false)}
            />
        </>
    )
}

