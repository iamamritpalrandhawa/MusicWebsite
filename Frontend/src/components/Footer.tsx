
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
export default function Footer() {
    return (<>
        <footer className="bg-background border-t px-4 md:px-6 py-4 text-muted-foreground mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left Section */}
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} Music App. All rights reserved.
                </div>

                {/* Navigation Links */}
                <nav className="flex gap-4 text-sm">
                    <a href="#about" className="hover:underline underline-offset-4">
                        About
                    </a>
                    <a href="#terms" className="hover:underline underline-offset-4">
                        Terms of Service
                    </a>
                    <a href="#privacy" className="hover:underline underline-offset-4">
                        Privacy Policy
                    </a>
                </nav>

                {/* Social Media Icons */}
                <div className="flex gap-3">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <TwitterIcon className="w-5 h-5" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <FacebookIcon className="w-5 h-5" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <InstagramIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
        <div className="h-60 sm:h-24">
        </div>
    </>
    );
}