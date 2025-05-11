"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface MultiItemCarouselProps {
    items: React.ReactNode[] | undefined
}

export default function MultiItemCarousel({ items }: MultiItemCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(2)
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(3)
            } else {
                setItemsPerPage(5)
            }
        }

        updateItemsPerPage()
        window.addEventListener('resize', updateItemsPerPage)
        return () => window.removeEventListener('resize', updateItemsPerPage)
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            Math.min(prevIndex + 1, (items?.length ?? 0) - itemsPerPage)
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div className="overflow-hidden" ref={carouselRef}>
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                >
                    {items?.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 -left-4 transform -translate-y-1/2"
                onClick={prevSlide}
                disabled={currentIndex === 0}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 -right-4 transform -translate-y-1/2"
                onClick={nextSlide}
                disabled={currentIndex >= (items?.length ?? 0) - itemsPerPage}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}

