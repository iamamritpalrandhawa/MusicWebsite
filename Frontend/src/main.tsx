import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { AuthProvider } from "@/contexts/auth-context.tsx"
import { ThemeProvider } from "@/components/ui/theme-provider.tsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AlbumsPage from "@/components/AlbumPage.tsx";
import ProfilePage from "@/components/Profile.tsx";
import SearchPage from "./components/SearchPage.tsx";
import Login from "@/components/Login.tsx";
import { ToastProvider } from "@/components/ui/toast.tsx"
import Signup from "@/components/Signup.tsx";
import { MusicProvider } from "@/contexts/music-context.tsx";
import { store } from '@/store/store.ts'
import { Provider } from 'react-redux'
import Layout from "@/Layout.tsx";
import ArtistPage from "@/components/ArtistPage.tsx";
import PlaylistPage from "@/components/PlaylistPage.tsx";
import ControllerProvider from "@/contexts/controller-context.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><App /></Layout>,
  },
  {
    path: "/album",
    element: <Layout><AlbumsPage /></Layout>,
  },
  {
    path: '/playlist',
    element: <Layout><PlaylistPage /></Layout>,
  },
  {
    path: "/artist",
    element: <Layout><ArtistPage /></Layout>,
  },
  {
    path: "/profile",
    element: <Layout><ProfilePage /></Layout>,
  },
  {
    path: "/search",
    element: <Layout><SearchPage /></Layout>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
      <ToastProvider>
        <MusicProvider>
          <AuthProvider>
            <ControllerProvider>
              <RouterProvider router={router} />
            </ControllerProvider>
          </AuthProvider>
        </MusicProvider>
      </ToastProvider>
    </ThemeProvider>
  </Provider>
);
