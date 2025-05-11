import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import '@/signstyle.css';

function Signup() {
    const { signup, checkUsername } = useAuth();
    const navigate = useNavigate();
    const [isDarkMode] = useState(true);
    const [available, setAvailable] = useState(true);
    const { toast } = useToast();
    const [user, setUser] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        if (e.target.name === "username" && e.target.value.length > 0) {
            checkUsername(e.target.value).then((res) => {
                setAvailable(res);
            });
        }

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = user;
        if (!available) {
            toast({
                title: "Error",
                description: "Username must be unique",
                duration: 2000,
                variant: "destructive",
            });
        }
        else if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Password and Confirm Password must be the same.",
                duration: 2000,
                variant: "destructive",
            });
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await signup(email, username, password);
            if (response?.success) {
                localStorage.setItem("token", response.authtoken);
                toast({
                    title: "Success",
                    description: "Logged in successfully",
                    duration: 2000,
                });
                navigate("/");
            } else {
                toast({
                    title: "Error",
                    description: response,
                    duration: 2000,
                });
            }
        }
    };

    return (
        <div className="main-container-1" style={{ backgroundColor: isDarkMode ? "#161616" : "#edefde" }}>
            <div className="container-3" style={{ overflow: "visible" }}>
                <img src="/signup.jpg" alt="music" />
            </div>
            <div className="container-4">
                <div className="form-container">
                    <h2 style={{ color: isDarkMode ? "white" : "#3f4238" }}>Sign Up</h2>
                    <p id="para-1" style={{ color: isDarkMode ? "#888" : "#3f4238" }}>Create your account. It's quick and easy.</p>
                    <form id="signupForm" onSubmit={handleSubmit}>
                        <div className="input-field flex-col" id={isDarkMode ? 'dark-mode' : 'light-mode'}>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={user.username}
                                onChange={handleChange}
                                required
                                style={{ backgroundColor: isDarkMode ? "#333333" : "#afb59e7d", color: isDarkMode ? "white" : "#161616" }}
                            />
                            {!available &&
                                <h6 className="text-red-500">Username must be unique</h6>}
                        </div>
                        <div className="input-field" id={isDarkMode ? 'dark-mode' : 'light-mode'}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={user.email}
                                onChange={handleChange}
                                style={{ backgroundColor: isDarkMode ? "#333333" : "#afb59e7d", color: isDarkMode ? "white" : "#161616" }}
                            />
                        </div>
                        <div className="input-field" id={isDarkMode ? 'dark-mode' : 'light-mode'}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={user.password}
                                onChange={handleChange}
                                style={{ backgroundColor: isDarkMode ? "#333333" : "#afb59e7d", color: isDarkMode ? "white" : "#161616" }}
                            />
                            <i
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    fontSize: 24, position: "absolute", right: 9,
                                    top: 7, color: isDarkMode ? "white" : "#161616", cursor: "pointer"
                                }}
                                className="fa">{showPassword ? "" : ""}</i>
                        </div>
                        <div className="input-field" id={isDarkMode ? 'dark-mode' : 'light-mode'}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                required
                                value={user.confirmPassword}
                                onChange={handleChange}
                                style={{ backgroundColor: isDarkMode ? "#333333" : "#afb59e7d", color: isDarkMode ? "white" : "#161616" }}
                            />
                        </div>
                        <button
                            id="submit"
                            style={{ backgroundColor: isDarkMode ? "#333333" : "#afb59e7d", color: isDarkMode ? "white" : "#3f4238" }}
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p id="para-2" style={{ color: isDarkMode ? "#888" : "#3f4238" }}>
                        If you already have an account, <Link to="/login" id="link">Sign In</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
