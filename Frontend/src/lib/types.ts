export interface Artist {
  artistId: string;
  name: string;
  description?: string; // Optional description field
  subscribers: string;
  thumbnails: string;
  thumbnailUrl: string;
  albums?: Album[]; // Optional albums, since not all artists may have albums listed here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singles?: any[]; // Adjusted to any[] since there are no items in the "singles" array
  songsPlaylistId?: string;
  suggestedArtists?: SuggestedArtist[];
  songs: Song[];
}

export interface Album {
  albumId: string;
  artistId: string;
  title: string;
  artists: ArtistInfo[];
  year: string;
  durationStr?: string;
  isExplicit: boolean;
  thumbnailUrl: string;
  type: string;
  youtubeId: string;
  id: string;
  duration: Duration;
  artist: string;
  album?: { id: string };
}

export interface Playlist {
  id: string;
  title: string;
  playlistId: string;
  totalSongs: string;
  type: "Playlist";
  year: string;
  thumbnailUrl: string;
  durationStr: string;
  tracks: Song[];
  album: AlbumInfo;
}

interface Duration {
  label: string;
  totalSeconds: number;
}

export interface Song {
  id: string;
  title: string;
  youtubeId: string;
  artists: ArtistInfo[];
  artist: ArtistInfo;
  album: AlbumInfo;
  duration: Duration;
  isExplicit: boolean;
  durationStr: string;
  thumbnailUrl: string;
}

export interface ArtistInfo {
  name: string;
  id: string;
}

interface AlbumInfo {
  name: string;
  id: string;
}

export interface SuggestedArtist {
  artistId: string;
  name: string;
  subscribers: string;
  thumbnailUrl: string;
}

export interface SearchResult {
  id: string;
  name: string;
  type: "artist" | "album" | "playlist" | "song";
  imageUrl: string;
  duration?: Duration;
  isExplicit?: boolean;
  album?: AlbumInfo;
  title: string;
  durationInSeconds: string;
  thumbnailUrl: string;
  artists?: ArtistInfo[];
  youtubeId?: string;
}

export interface Music {
  album: AlbumInfo;
  artists: ArtistInfo[];
  duration: Duration;
  isExplicit: boolean;
  thumbnailUrl: string;
  title: string;
  youtubeId: string;
}
