import type React from "react";
import { Button } from "./ui/button";
import { User, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex-1 flex justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:text-primary text-purple-400/90"
              onClick={handleDashboardClick}
            >
              <Film className="h-5 w-5" />
              <span className="text-xl font-semibold">iTunes</span>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
