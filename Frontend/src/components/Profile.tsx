"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Toaster } from "@/components/ui/toaster";

import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentSongs } from "./recent-songs"
import { Edit } from "lucide-react"
import { Song } from "@/lib/types"
import { useMusic } from "@/contexts/music-context"


export default function ProfilePage() {
    const { user, logout, updateUsername, fetchUser, updatePassword, recentSongs } = useAuth()
    const { getMusicById } = useMusic();
    const router = useNavigate()
    const { toast } = useToast()
    const [username, setUsername] = useState(user?.username || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [EditState, setEditState] = useState(false)
    const [Songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        // Fetch all songs corresponding to the recentSongs IDs
        const fetchSongs = async () => {
            const fetchedSongs = await Promise.all(
                recentSongs?.map((id: string) => getMusicById(id)) ?? []
            );
            setSongs(fetchedSongs); // Set only the new items
        };

        fetchSongs();
    }, [recentSongs]);

    useEffect(() => {
        console.log(Songs);
    }, [Songs]);


    const [hasToken] = useState(localStorage.getItem("token"))
    useEffect(() => {
        if (!hasToken) {
            router('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasToken])

    useEffect(() => {
        setUsername(user?.username || "")
    }, [user])


    if (!user) {
        router('/')
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (username === "") {
            setEditState(false); fetchUser(); toast({
                title: "Error",
                description: "Username cannot be empty.",
                variant: "destructive",
            }); return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updated: any = await updateUsername(username)

        if (updated.success == true) {
            toast({
                title: "Username Updated",
                description: "Your username has been successfully updated.",
            })
        } else {
            console.log(updated.msg)
            toast({
                title: "Error",
                description: updated.msg,
            })
            setUsername(user?.username || "")
        }
        setEditState(false)
    }

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "New password and confirm password do not match.",
                variant: "destructive",
            })
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updated: any = await updatePassword(currentPassword, newPassword)
        if (updated.success == true) {
            toast({
                title: "Password Updated",
                description: "Your password has been successfully updated.",
            })
        }
        else {
            toast({
                title: "Error",
                description: updated.msg,
            })
        }
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }

    const handleLogout = () => {
        logout()
        router('/')
    }

    return (
        <div className="flex-grow">
            <div className="container mx-auto py-8 px-4">

                <div className="flex justify-center items-center">
                    <Card className="w-full max-w-screen-xl mx-auto">
                        <CardHeader>
                            <CardTitle><h1 className="text-3xl font-bold">Your Profile</h1></CardTitle>
                        </CardHeader>
                        <CardContent className="py-0  px-3">
                            <div className="flex flex-col items-center space-y-6">
                                {/* Avatar Section */}
                                <div className="flex justify-center">
                                    <Avatar className="w-20 h-20 border-2 border-accent">
                                        <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                        <AvatarFallback className="text-sm font-medium text-primary">{(() => {
                                            const parts = username.split(" ");
                                            const firstInitial = parts[0]?.[0]?.toUpperCase() || "";
                                            const secondInitial = parts[1]?.[0]?.toUpperCase() || "";
                                            return firstInitial + secondInitial;
                                        })()}</AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Conditional Edit State */}
                                {EditState ? (
                                    <div className="flex sm:flex-row flex-col w-full max-w-md justify-center items-center">
                                        <Input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={handleUsernameChange}
                                            className="mt-1 w-[90%] sm:w-2/3 md:w-1/2"
                                            placeholder="Enter your username"
                                        />
                                        <Button size="sm" onClick={handleUsernameSubmit} className="mt-4 sm:mt-0 w-1/3 ml-5  bg-white text-black hover:bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200">
                                            Save
                                        </Button>
                                    </div>

                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Label htmlFor="username" className="text-lg font-medium">
                                            {username || 'Username'}
                                        </Label>
                                        <Edit
                                            className="h-4 w-4 text-accent cursor-pointer"
                                            onClick={() => setEditState(true)}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>



                        <CardHeader>
                            <CardTitle>Account Security</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="password">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="password">Reset Password</TabsTrigger>
                                    <TabsTrigger value="logout">Logout</TabsTrigger>
                                </TabsList>
                                <TabsContent value="password">
                                    <form onSubmit={handlePasswordReset} className="space-y-4">
                                        <div>
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                type="password"
                                                id="current-password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                type="password"
                                                id="new-password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input
                                                type="password"
                                                id="confirm-password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <Button className="bg-white text-black hover:bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200">Reset Password</Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="logout">
                                    <CardDescription>Are you sure you want to logout?</CardDescription>
                                    <Button onClick={handleLogout} variant="destructive" className="mt-4">Logout</Button>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recently Played</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentSongs songs={Songs} />
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </div>
    )
}

