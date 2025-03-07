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
} from "lucide-react";

// Define the new Movie type
export type Movie = {
  ID: number;
  TITRE: string;
  RESUME: string;
  ANNEE: number;
  DUREE: number;
  LANGUE: string;
  ID_REALISATEUR: number;
  POSTER_URL: string;
};

// Mock data for testing
const mockMovieData: Movie = {
  ID: 1,
  TITRE: "Inception",
  RESUME: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  ANNEE: 2010,
  DUREE: 148,
  LANGUE: "English",
  ID_REALISATEUR: 1,
  POSTER_URL: "https://example.com/inception-poster.jpg",
};

const TestPage = () => {

  const handleWatchTrailer = () => {
    console.log('Opening trailer for:', mockMovieData.TITRE);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[55vh] overflow-hidden p-0">
          <div className="relative w-full h-64 md:h-80 bg-gradient-to-b from-black/70 to-background overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
              style={{ backgroundImage: `url(${mockMovieData.POSTER_URL})` }}
            />
            <div className="absolute inset-0 bg-black/40 flex p-6">
              <div className="flex flex-col md:flex-row gap-6 z-10 w-full">
                <div className="hidden md:block flex-shrink-0 w-40 h-auto shadow-lg rounded-md overflow-hidden">
                  <img 
                    src={mockMovieData.POSTER_URL} 
                    alt={mockMovieData.TITRE} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-end text-white space-y-2 flex-grow">
                  <h1 className="text-2xl md:text-3xl font-bold">{mockMovieData.TITRE}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{mockMovieData.ANNEE}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{mockMovieData.DUREE} min</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>{mockMovieData.LANGUE}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={handleWatchTrailer} 
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Trailer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="text-white md:w-auto md:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>
            </div>
            <div className="relative h-[calc(90vh-80px-16rem)] md:h-[calc(90vh-80px-12rem)]">
              <ScrollArea className="h-full pb-6">
                <TabsContent value="overview" className="px-6 py-4 mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                      <p className="text-muted-foreground">
                        {mockMovieData.RESUME || 
                          "No synopsis available for this movie."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="px-6 py-4 mt-0">
                  <div className="p-8 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Technical Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Release Year</span>
                          <span>{mockMovieData.ANNEE}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Runtime</span>
                          <span>{mockMovieData.DUREE} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Language</span>
                          <span>{mockMovieData.LANGUE}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;
