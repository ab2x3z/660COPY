import { Card } from "../components/ui/card";
import { PersonSuggestion } from "../../types";

export type PersonSuggestionsProps = {
  suggestions: PersonSuggestion[];
  onSelect: (suggestion: PersonSuggestion) => void;
  visible: boolean;
};

const PersonSuggestions = ({
  suggestions,
  onSelect,
  visible,
}: PersonSuggestionsProps) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 bg-white border border-input">
      <div className="w-full">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm text-sm bg-white text-black"
          >
            {suggestion.name}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PersonSuggestions;
