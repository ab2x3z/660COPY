import { Card } from "../components/ui/card";
import { MovieSuggestion } from "../../types";

type MovieSuggestionsProps = {
  suggestions: MovieSuggestion[];
  onSelect: (suggestion: MovieSuggestion) => void;
  visible: boolean;
};

const MovieSuggestions = ({
  suggestions,
  onSelect,
  visible,
}: MovieSuggestionsProps) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 bg-white border border-input">
      <div className="w-full">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm text-sm bg-white text-black"
          >
            {suggestion.TITRE}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default MovieSuggestions;
