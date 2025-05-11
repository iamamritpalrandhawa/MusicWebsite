import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster"
import { useNavigate, Link } from "react-router-dom";
import "@/signstyle.css";
function Login() {
    const { toast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isDarkMode] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast({
                title: "Error",
                description: "Please fill all the fields",
                duration: 2000
            });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const answer: any = await login(formData.username, formData.password);
        if (answer?.success == true) {
            localStorage.setItem("token", answer.authtoken);
            toast(
                {
                    title: "Success",
                    description: "Logged in successfully",
                    duration: 2000
                }
            )
            navigate("/");
        } else {
            toast({
                title: "Error",
                description: answer ? answer : "Something went wrong",
                duration: 2000,
            });
        }
    };

    return (
        <div
            className="main-container-1"
            style={{ backgroundColor: isDarkMode ? "#161616" : "#edefde" }}
        >
            <div className="container-3" style={{ overflow: "visible" }}>
                <img src="/signup.jpg" alt="music" />
            </div>
            <div className="container-4">
                <div className="form-container">
                    <h2 style={{ color: isDarkMode ? "white" : "#3f4238" }}>Sign In</h2>
                    <p
                        id="para-1"
                        style={{ color: isDarkMode ? "#888" : "#3f4238" }}
                    >
                        Sign in to your account to continue.
                    </p>
                    <form id="signupForm" onSubmit={handleSubmit}>
                        <div
                            className="input-field"
                            id={isDarkMode ? "dark-mode" : "light-mode"}
                        >
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username or Email"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                style={{
                                    backgroundColor: isDarkMode
                                        ? "#333333"
                                        : "#afb59e7d",
                                    color: isDarkMode ? "white" : "#161616",
                                }}
                            />
                        </div>
                        <div
                            className="input-field"
                            id={isDarkMode ? "dark-mode" : "light-mode"}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    backgroundColor: isDarkMode
                                        ? "#333333"
                                        : "#afb59e7d",
                                    color: isDarkMode ? "white" : "#161616",
                                }}
                            />
                            <i
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    fontSize: 24,
                                    position: "absolute",
                                    right: 9,
                                    top: 11,
                                    color: isDarkMode ? "white" : "#161616",
                                    cursor: "pointer",
                                }}
                                className="fa"
                            >
                                {showPassword ? "" : ""}
                            </i>
                        </div>
                        <button
                            id="submit"
                            style={{
                                backgroundColor: isDarkMode
                                    ? "#333333"
                                    : "#afb59e7d",
                                color: isDarkMode ? "white" : "#3f4238",
                            }}
                        >
                            Sign In
                        </button>
                    </form>
                    <p
                        id="para-2"
                        style={{ color: isDarkMode ? "#888" : "#3f4238" }}
                    >
                        Don't have an account? <Link to="/signup" id="link">Sign up</Link>
                    </p>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default Login;
