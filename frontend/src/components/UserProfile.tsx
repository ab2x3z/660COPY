import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useProfileStore } from "../../hooks/use-profile-store";
import Header from "./Header";
import {
  User as UserIcon,
  Mail,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Package,
  Film,
} from "lucide-react";
import axios from "axios";
import { Movie } from "../../types.ts";

const ProfilePage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useProfileStore();
  const [rentedMovies, setRentedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentedMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BACKEND_URL}/users/rented-movies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRentedMovies(response.data);
      } catch (err) {
        console.error("Error fetching rented movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentedMovies();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen w-screen">
      <Header title="Profile" />
      <div className="container mx-auto px-4 py-8 pt-24">
        <Tabs defaultValue="personal" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="bg-gray-200" value="personal">
              Personal Information
            </TabsTrigger>
            <TabsTrigger className="bg-gray-200" value="subscription">
              Subscription & Credits
            </TabsTrigger>
            <TabsTrigger className="bg-gray-200" value="movies">
              My Movies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <UserIcon className="w-6 h-6" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-lg font-medium">{`${user.prenom} ${user.nom_famille}`}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <p className="text-lg">{user.courriel}</p>
                    </div>
                  </div>
                  {user.tel && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <p className="text-lg">{user.tel}</p>
                      </div>
                    </div>
                  )}
                  {user.date_anniversaire && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Birthday
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <p className="text-lg">
                          {new Date(
                            user.date_anniversaire,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(user.adresse ||
                  user.ville ||
                  user.province ||
                  user.code_postal) && (
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.adresse && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Street Address
                          </label>
                          <p className="text-lg">{user.adresse}</p>
                        </div>
                      )}
                      {user.ville && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            City
                          </label>
                          <p className="text-lg">{user.ville}</p>
                        </div>
                      )}
                      {user.province && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Province
                          </label>
                          <p className="text-lg">{user.province}</p>
                        </div>
                      )}
                      {user.code_postal && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Postal Code
                          </label>
                          <p className="text-lg">{user.code_postal}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.forfait && (
                    <div className="p-6 bg-primary/5 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Current Plan
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        {user.forfait === "A"
                          ? "Premium"
                          : user.forfait === "B"
                            ? "Standard"
                            : user.forfait === "C"
                              ? "Basic"
                              : "Free"}
                      </p>
                    </div>
                  )}

                  <div className="p-6 bg-primary/5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Available Credits
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      {user.credits || 0} credits
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movies">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Film className="w-6 h-6" />
                  My Rented Movies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error: {error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : rentedMovies.length === 0 ? (
                  <div className="text-center py-12">
                    <Film className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                      You haven't rented any movies yet.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/browse")}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Browse Movies
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentedMovies.map((movie) => (
                      <div
                        key={movie.ID}
                        className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow"
                      >
                        <div className="aspect-[2/3] relative">
                          {movie.POSTER_URL ? (
                            <img
                              src={movie.POSTER_URL}
                              alt={`${movie.TITRE} poster`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted">
                              <Film className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-1">
                            {movie.TITRE}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            {movie.ANNEE && <span>{movie.ANNEE}</span>}
                            {movie.DUREE && <span>•</span>}
                            {movie.DUREE && <span>{movie.DUREE} min</span>}
                            {movie.LANGUE && <span>•</span>}
                            {movie.LANGUE && <span>{movie.LANGUE}</span>}
                          </div>
                          {movie.RESUME && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {movie.RESUME}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
