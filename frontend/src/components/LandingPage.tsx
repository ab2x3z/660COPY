import { useState } from "react";
import { Button } from "./ui/button";
import { Film } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignInModal from "./../Modal/sign-in-modal";
import { useProfileStore } from "../../hooks/use-profile-store";

const LandingPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { setUser } = useProfileStore();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string>("");

  const fecthUserInformation = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BACKEND_URL}/users/myaccount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);

    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSignInClick = async (formData: {
    courriel: string;
    mot_de_passe: string;
  }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      await fecthUserInformation();

      navigate("/dashboard");
      setShowModal(false);
    } catch (error: any) {
      if (error.response.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-screen flex flex-col items-center h-screen justify-center">
      <a
        className="flex items-center justify-center fixed top-0 pt-10"
        href="#"
      >
        <Film className="h-6 w-6" />
        <span className="text-2xl font-bold">iTunes</span>
      </a>
      <div className="flex flex-col items-center space-y-4 text-center mt-20 pb-32">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Trouvez Votre Film Préféré
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Explorez et découvrez des milliers de films. La soirée cinéma
            parfaite est à portée de clic.
          </p>
        </div>
        <div className="w-full max-w-sm space-y-2">
          <form className="flex space-x-2" onSubmit={handleSearchClick}>
            <Input
              className="max-w-lg flex-1"
              placeholder="Recherchez un film..."
              type="text"
            />
            <Button type="submit">Rechercher</Button>
          </form>
        </div>
      </div>
      <SignInModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSignIn={handleSignInClick}
        error={error}
      />
    </div>
  );
};

export default LandingPage;
