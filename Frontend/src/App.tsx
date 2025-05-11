"use client";

import { useEffect, useState } from "react";
import BannerCarousel from "@/components/banner-carosuel";
import MultiItemCarousel from "@/components/multi-item-carousel";
import SongCard from "@/components/SongCard";
import { useMusic } from "@/contexts/music-context";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { useSelector } from "react-redux";
import { addToQueue, clearQueue } from "@/store/Slice/queue";
import { setSongID } from "@/store/Slice/song";
import { RootState } from "./store/store";
import { Album } from "./lib/types";

function App() {
  const navigate = useNavigate();
  const { getNewReleases, getPlaylistById, getAlbumById } = useMusic();
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const dispatch = useDispatch();
  const queue = useSelector((state: RootState) => state.queue.queue);
  const songID = useSelector((state: RootState) => state.songID.songID);
  useEffect(() => {
    console.log(queue)
  }, [queue])
  const [featuredPlaylists, setFeaturedPlaylists] = useState([{
    title: "Summer Hits",
    description: "The hottest tracks to keep your summer sizzling!",
    imageUrl: "/placeholder.svg",
    actionLabel: "Play Now",
  },
  {
    title: "Chill Vibes",
    description: "Relax and unwind with these smooth tunes",
    imageUrl: "/placeholder.svg",
    actionLabel: "Start Listening",
  },
  {
    title: "Workout Mix",
    description: "Get pumped with high-energy tracks",
    imageUrl: "/placeholder.svg",
    actionLabel: "Let's Go",
  },
  ]);
  useEffect(() => {
    getNewReleases().then((data) => {
      setTrending(data);
    });
    getPlaylistById("VLRDTMAK5uy_lr0LWzGrq6FU9GIxWvFHTRPQD2LHMqlFA").then((data) => {
      setNewReleases(data.tracks);
    });
    getPlaylistById("VLRDCLAK5uy_m7I7OhxMQp4dAK2AKvrEoiNmrIDnAX5Z8").then((data) => {
      data.actionLabel = "Play Now";
      setFeaturedPlaylists([data]);
    });

    getPlaylistById("VLRDCLAK5uy_kb7EBi6y3GrtJri4_ZH56Ms786DFEimbM").then((data) => {
      data.actionLabel = "Relax and unwind with these smooth tunes";
      setFeaturedPlaylists((prevPlaylists) => [...prevPlaylists, data]);
    });
    getPlaylistById("VLRDCLAK5uy_kuo_NioExeUmw07dFf8BzQ64DFFTlgE7Q").then((data) => {
      data.actionLabel = "Get pumped with high-energy tracks";
      setFeaturedPlaylists((prevPlaylists) => [...prevPlaylists, data]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-grow">
      <div className="container mx-auto px-4 py-4 sm:py-6 sm:pt-8 md:px-3">
        <BannerCarousel
          items={featuredPlaylists.map((playlist: any) => ({
            title: playlist.title,
            thumbnailUrl: playlist.thumbnailUrl,
            durationStr: playlist.durationStr,
            actionLabel: playlist.actionLabel,
            onAction: () => {
              navigate(`/playlist?id=${playlist.id}`);
            }
          }))}
        />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-12 mb-4 sm:mb-6 px-4 sm:px-6">
        New Releases </h2>
      <MultiItemCarousel
        items={newReleases.map((song: any, index) => (
          <SongCard
            key={index}
            name={song.title}
            artist={song.artist?.name}
            imageUrl={song.thumbnailUrl}
            onAddToQueue={() => {
              if (songID !== song.id)
                dispatch(addToQueue(song.id))
            }}
            onPlay={() => {
              dispatch(setSongID(song.id));
            }}
            onClick={() => {
              if (song.album == null) {
                console.log("No album found")
                return
              }
              navigate(`/album?id=${song.album.albumId}`)
            }}
          />
        ))}
      />

      <h2 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-8 mb-4 sm:mb-6 px-4 sm:px-6">
        Trending Songs</h2>
      <MultiItemCarousel
        items={trending.map((song: any, index) => (
          <SongCard
            key={index}
            name={song.name}
            artist={song.artist}
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
              navigate(`/album?id=${song.albumId}`)
            }}
          />
        ))}
      />


    </div>
  );
}

export default App;
