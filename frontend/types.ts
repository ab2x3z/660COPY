export type User = {
  name: string;
  email: string;
  nom_famille: string;
  prenom: string;
  courriel: string;
  tel?: string;
  date_anniversaire?: Date;
  adresse?: string;
  ville?: string;
  province?: string;
  code_postal?: string;
  forfait?: string;
  credits?: number;
};

export type MovieSuggestion = {
  ID: number;
  TITRE: string;
  ANNEE: number;
  DUREE: number;
  POSTER_URL: string;
};

export type Movie = {
  ID: number;
  TITRE: string;
  RESUME: string;
  ANNEE: number;
  DUREE: number;
  LANGUE: string;
  ID_REALISATEUR: number;
  POSTER_URL: string;
  ACTEURS: Array<Actor>;
  ANNONCES: Array<string>;
  GENRES: Array<string>;
  PAYS: Array<string>;
  SCENARISTES: Array<string>;
};

export type Actor = {
  id: number;
  nom: string;
  role?: string;
};

export type PersonSuggestion = {
  id: number;
  name: string;
};
