import Footer from "./components/Footer";
import { MusicPlayerControls } from "./components/MusicPlayerControls";
import Navbar from "./components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Footer />
            <MusicPlayerControls />
        </div>
    );
}