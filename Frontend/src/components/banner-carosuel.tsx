"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface BannerItem {
    title: string
    thumbnailUrl: string
    actionLabel: string
    durationStr: string
    onAction: () => void
}

interface BannerCarouselProps {
    items: BannerItem[]
}

export default function BannerCarousel({ items }: BannerCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
    }

    return (
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className=" absolute inset-0 object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent">
                        <div className="flex flex-col justify-center h-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                                {item.title}
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 line-clamp-2 sm:line-clamp-none">
                                {item.durationStr}
                            </p>
                            <Button
                                onClick={item.onAction}
                                className="w-fit px-4 py-2 text-sm sm:text-base bg-white text-black hover:bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200"
                            >
                                {item.actionLabel}
                            </Button>

                        </div>

                    </div>
                </div>
            ))}
            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2"
                onClick={prevSlide}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                onClick={nextSlide}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}

