import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
export default function ThemeTogglebutton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      size="icon"
      className="rounded-full bg-background/30"
      variant="outline"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      <Sun
        className="w-6 h-6 scale-100 transition-all dark:scale-0"
        color="#F9802D"
      />
      <Moon className="absolute w-6 h-6 scale-0 transition-all dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
