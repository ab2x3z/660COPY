import type React from "react";
import { debounce } from "lodash";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MovieSuggestions from "./MovieSuggestions";
import PersonSuggestions from "./PersonSuggestions";
import { Movie, PersonSuggestion } from "../../types";
import { MovieSuggestion } from "../../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import Header from "./Header";
import MovieCard from "./MovieCard";
import { useProfileStore } from "../../hooks/use-profile-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react"; // Import X icon
import { useModal } from "../../hooks/use-modal-store";
import { Pagination } from "../components/Pagination";

const Dashboard: React.FC = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useProfileStore();
  const navigate = useNavigate();
  const { onOpen } = useModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [yearRange, setYearRange] = useState([1900, 2025]);
  const [durationRange, setDurationRange] = useState([0, 240]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [excludedGenres, setExcludedGenres] = useState<string[]>([]);
  const [actor, setActor] = useState<PersonSuggestion | null>(null);
  const [director, setDirector] = useState<PersonSuggestion | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [actorSearchTerm, setActorSearchTerm] = useState("");
  const [debouncedActorSearchTerm, setDebouncedActorSearchTerm] = useState("");
  const [actorSuggestions, setActorSuggestions] = useState<PersonSuggestion[]>(
    [],
  );

  const [directorSearchTerm, setDirectorSearchTerm] = useState("");
  const [debouncedDirectorSearchTerm, setDebouncedDirectorSearchTerm] =
    useState("");
  const [directorSuggestions, setDirectorSuggestions] = useState<
    PersonSuggestion[]
  >([]);

  // Use refs for debounced functions to maintain their identity across renders
  const debounceSearchRef = useRef(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
  );

  const debounceActorSearchRef = useRef(
    debounce((value: string) => {
      setDebouncedActorSearchTerm(value);
    }, 300),
  );

  const debounceDirectorSearchRef = useRef(
    debounce((value: string) => {
      setDebouncedDirectorSearchTerm(value);
    }, 300),
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    fetchGenres();
  }, [user, navigate]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }
    getSuggestions();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!debouncedActorSearchTerm) {
      setActorSuggestions([]);
      return;
    }
    getActorSuggestions();
  }, [debouncedActorSearchTerm]);

  useEffect(() => {
    if (!debouncedDirectorSearchTerm) {
      setDirectorSuggestions([]);
      return;
    }
    getDirectorSuggestions();
  }, [debouncedDirectorSearchTerm]);

  const getSearchCriteria = useCallback(
    (page: number = currentPage) => {
      return {
        GENRES_INCLUS: selectedGenres,
        GENRES_EXCLUS: excludedGenres,
        ANNEE: yearRange[1],
        DUREE_MIN: durationRange[0] === 0 ? 1 : durationRange[0],
        DUREE_MAX: durationRange[1],
        ACTEURS: actor ? [actor.name] : [],
        SCENARISTES: director ? [director.name] : [],
        page,
        limit: itemsPerPage,
      };
    },
    [
      selectedGenres,
      excludedGenres,
      yearRange,
      durationRange,
      actor,
      director,
      currentPage,
      itemsPerPage,
    ],
  );

  const searchMovies = useCallback(
    async (page: number = currentPage) => {
      setSearchPerformed(true);
      const criterias = getSearchCriteria(page);

      try {
        const response = await axios.post(`${BACKEND_URL}/movies`, criterias, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setMovies(response.data.items);
        setTotalPages(response.data.total_pages);
        setTotalItems(response.data.total);
        setCurrentPage(response.data.page);
      } catch (error: any) {
        console.error(error);
      }
    },
    [BACKEND_URL, getSearchCriteria, currentPage],
  );

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/movies/all-genres`);
      setGenres(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const getSuggestions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/movies/suggestions/${debouncedSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuggestions(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const getActorSuggestions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/movies/actor/suggestion/${debouncedActorSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setActorSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching actor suggestions:", error);
    }
  };

  const getDirectorSuggestions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/movies/director/suggestion/${debouncedDirectorSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDirectorSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching director suggestions:", error);
    }
  };

  useEffect(() => {
    debounceSearchRef.current(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    debounceActorSearchRef.current(actorSearchTerm);
  }, [actorSearchTerm]);

  useEffect(() => {
    debounceDirectorSearchRef.current(directorSearchTerm);
  }, [directorSearchTerm]);

  useEffect(() => {
    if (actor || director) {
      searchMovies();
    }
  }, [actor, director, searchMovies]);

  const resetFilters = () => {
    setMovies([]);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSuggestions([]);
    setYearRange([1900, 2025]);
    setDurationRange([0, 240]);
    setSelectedGenres([]);
    setExcludedGenres([]);
    setActor(null);
    setDirector(null);
    setActorSearchTerm("");
    setDirectorSearchTerm("");
    setActorSuggestions([]);
    setDirectorSuggestions([]);
    setSearchPerformed(false);
    fetchGenres();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies();
  };

  const handleYearRangeChange = (value: number[]) => {
    setYearRange(value);
  };

  const handleDurationRangeChange = (value: number[]) => {
    setDurationRange(value);
  };

  const toggleGenre = (genre: string, list: "include" | "exclude") => {
    if (list === "include") {
      setSelectedGenres((prev) =>
        prev.includes(genre)
          ? prev.filter((g) => g !== genre)
          : [...prev, genre],
      );
    } else {
      setExcludedGenres((prev) =>
        prev.includes(genre)
          ? prev.filter((g) => g !== genre)
          : [...prev, genre],
      );
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      searchMovies(page);
    }
  };

  const onClickSelection = useCallback(
    async (movieId: number) => {
      setSuggestions([]);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/movies/movie/${movieId}`,
        );
        const movie: Movie = response.data;
        onOpen("movieModal", movie as Movie);
        setSearchTerm("");
      } catch (error: any) {
        console.error(error);
      }
    },
    [BACKEND_URL, onOpen],
  );

  const handleActorSelect = useCallback((person: PersonSuggestion) => {
    setActor(person);
    setActorSuggestions([]);
    setActorSearchTerm("");
  }, []);

  const handleDirectorSelect = useCallback((person: PersonSuggestion) => {
    setDirector(person);
    setDirectorSuggestions([]);
    setDirectorSearchTerm("");
  }, []);

  const handleActorDeselect = useCallback(() => {
    setActor(null);
    setMovies([]);
    setSearchPerformed(false);
  }, []);

  const handleDirectorDeselect = useCallback(() => {
    setDirector(null);
    setMovies([]);
    setSearchPerformed(false);
  }, []);

  const selectedPersonStyles =
    "flex items-center gap-2 mt-2 bg-secondary/50 p-2 rounded-sm";
  const deselectButtonStyles = "p-1 rounded-md hover:bg-gray-200 text-gray-500";

  return (
    <div className="bg-background min-h-screen w-screen">
      <Header title="Dashboard" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Card className="basis-3/4">
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="flex gap-2 relative">
                  <Input
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  {debouncedSearchTerm.length !== 0 && (
                    <MovieSuggestions
                      suggestions={suggestions.map((s: MovieSuggestion) => s)}
                      onSelect={(suggestion) => onClickSelection(suggestion.ID)}
                      visible={suggestions.length > 0}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Year Range ({yearRange[0]} - {yearRange[1]})
                  </Label>
                  <Slider
                    min={1900}
                    max={2025}
                    step={1}
                    value={yearRange}
                    onValueChange={handleYearRangeChange}
                    className="my-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Duration ({durationRange[0]} - {durationRange[1]} minutes)
                  </Label>
                  <Slider
                    min={0}
                    max={240}
                    step={5}
                    value={durationRange}
                    onValueChange={handleDurationRangeChange}
                    className="my-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Include Genres</Label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        variant={
                          selectedGenres.includes(genre) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleGenre(genre, "include")}
                        type="button"
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Exclude Genres</Label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        variant={
                          excludedGenres.includes(genre) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleGenre(genre, "exclude")}
                        type="button"
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="justify-end pt-3 flex gap-4">
                  <Button type="submit">Search</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="basis-1/4">
            <CardHeader>
              <CardTitle>People Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Actor</Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter actor name..."
                      value={actorSearchTerm}
                      onChange={(e) => setActorSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    {debouncedActorSearchTerm.length !== 0 && (
                      <PersonSuggestions
                        suggestions={actorSuggestions.map(
                          (s: PersonSuggestion) => s,
                        )}
                        onSelect={handleActorSelect}
                        visible={actorSuggestions.length > 0}
                      />
                    )}
                  </div>
                  {actor && (
                    <div className={selectedPersonStyles}>
                      <Label className="flex-1">{actor.name}</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className={deselectButtonStyles}
                        onClick={handleActorDeselect}
                      >
                        <X size={8} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Director</Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter director name..."
                      value={directorSearchTerm}
                      onChange={(e) => setDirectorSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    {debouncedDirectorSearchTerm.length !== 0 && (
                      <PersonSuggestions
                        suggestions={directorSuggestions.map(
                          (s: PersonSuggestion) => s,
                        )}
                        onSelect={handleDirectorSelect}
                        visible={directorSuggestions.length > 0}
                      />
                    )}
                  </div>
                  {director && (
                    <div className={selectedPersonStyles}>
                      <Label className="flex-1">{director.name}</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className={deselectButtonStyles}
                        onClick={handleDirectorDeselect}
                      >
                        <X size={8} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.length > 0
            ? movies.map((movie) => <MovieCard key={movie.ID} movie={movie} />)
            : searchPerformed && (
                <div className="col-span-full text-center text-gray-500 flex flex-col items-center">
                  <FontAwesomeIcon icon={faRobot} size="3x" className="mb-4" />
                  <span>
                    Il n'y a pas de films correspondant aux filtres de
                    recherche. Oups!
                  </span>
                </div>
              )}
        </div>

        {movies.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            maxVisiblePages={5}
            goToPage={goToPage}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
