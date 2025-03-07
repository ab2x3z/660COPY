import {
  Dialog,
  DialogContent,
} from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Clock,
  Calendar,
  Globe,
  Play,
  ShoppingCart,
  MapPin
} from "lucide-react";
import { useModal } from "../../hooks/use-modal-store";
import { Movie } from "../../types";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfileStore } from "../../hooks/use-profile-store";

const MovieDetailsModal = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "movieModal";
  const navigate = useNavigate();
  const { updateUserCredits } = useProfileStore();

  
  const movie: Movie | null = data;
  console.log("Movie details:", movie);

  if (!isModalOpen || !movie) return null;

  const handleWatchTrailer = () => {
    if (movie.ANNONCES && movie.ANNONCES.length > 0) {
      window.open(movie.ANNONCES[0], '_blank');
    } else {
      console.log('No trailer available for:', movie.TITRE);
    }
  };

  const handleRentMovie = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}/users/rent/${movie.ID}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateUserCredits(response.data.credits);

      console.log("Movie rented:", response);
      navigate("/profile");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[65vh] overflow-hidden p-0">
        <div className="relative w-full h-64 md:h-80 bg-gradient-to-b from-black/70 to-background overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
            style={{ backgroundImage: `url(${movie.POSTER_URL})` }}
          />
          <div className="absolute inset-0 bg-black/40 flex p-6">
            <div className="flex flex-col md:flex-row gap-6 z-10 w-full">
              <div className="hidden md:block flex-shrink-0 w-40 h-auto shadow-lg rounded-md overflow-hidden">
                <img 
                  src={movie.POSTER_URL} 
                  alt={movie.TITRE} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-end text-white space-y-2 flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold">{movie.TITRE}</h1>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {movie.GENRES && movie.GENRES.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/20 text-primary-foreground">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80 mt-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{movie.ANNEE}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{movie.DUREE} min</span>
                  </div>
                  {movie.LANGUE && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>{movie.LANGUE}</span>
                    </div>
                  )}
                  {movie.PAYS && movie.PAYS.length > 0 && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{movie.PAYS.join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    onClick={handleWatchTrailer} 
                    className="bg-primary hover:bg-primary/90"
                    disabled={!movie.ANNONCES || movie.ANNONCES.length === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Trailer
                  </Button>
                  
                  <Button 
                    onClick={handleRentMovie} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Rent Movie
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid grid-cols-2 md:w-auto md:inline-grid">
              <TabsTrigger className="bg-gray-200" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="bg-gray-200" value="details">Details</TabsTrigger>
            </TabsList>
          </div>

          <div className="relative h-[calc(90vh-80px-16rem)] md:h-[calc(90vh-80px-12rem)]">
            <ScrollArea className="h-full pb-6">
              <TabsContent value="overview" className="px-6 py-4 mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground">
                      {movie.RESUME || 
                        "No synopsis available for this movie."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-48 pr-2">
                      {movie.GENRES && movie.GENRES.map((genre, index) => (
                        <Badge key={index} variant="outline">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="px-6 py-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Technical Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Release Year</span>
                        <span>{movie.ANNEE}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Runtime</span>
                        <span>{movie.DUREE} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Language</span>
                        <span>{movie.LANGUE}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country</span>
                        <span>{movie.PAYS ? movie.PAYS.join(', ') : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Movie ID</span>
                        <span>{movie.ID}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Trailer</h3>
                    {movie.ANNONCES && movie.ANNONCES.length > 0 ? (
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleWatchTrailer}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Trailer
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No trailer available for this movie.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsModal;
