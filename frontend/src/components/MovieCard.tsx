import type React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { MovieSuggestion, Movie } from "../../types";
import { useModal } from "../../hooks/use-modal-store";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface MovieCardProps {
  movie: MovieSuggestion;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { onOpen } = useModal();
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const onCardClick = async () => {
    try {
      setLoading(true);
      console.log("Fetching complete details for movie:", movie.ID);
      
      const response = await axios.get(`${BACKEND_URL}/movies/movie/${movie.ID}`);
      const fullMovieData: Movie = response.data;
      
      onOpen("movieModal", fullMovieData);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      onOpen("movieModal", movie as unknown as Movie);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card key={movie.ID} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[2/3] relative">
          <Button 
            onClick={onCardClick} 
            disabled={loading}
            className="w-full h-full p-0 m-0 rounded-none"
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : null}
            <img
              src={movie.POSTER_URL || "/placeholder.svg"}
              alt={movie.TITRE}
              className="object-cover absolute inset-0 w-full h-full"
            />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg leading-tight">
              {movie.TITRE}
            </h3>
            <p className="text-sm text-muted-foreground">
              {movie.ANNEE} • {movie.DUREE} min
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
