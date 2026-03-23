import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { searchCities, type GeoResult } from "@/lib/api";
import { MapPin, Search, Loader2 } from "lucide-react";

interface CitySearchProps {
  onSelect: (city: GeoResult) => void;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const cities = await searchCities(query);
      setResults(cities);
      setOpen(cities.length > 0);
      setLoading(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search a city or town..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-base rounded-xl border-border bg-card shadow-sm"
          aria-label="City search"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
          {results.map((city) => (
            <li key={city.id}>
            <button
                aria-label="city-suggestion"
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => {
                  onSelect(city);
                  setQuery(`${city.name}, ${city.country}`);
                  setOpen(false);
                }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-popover-foreground">
                  {city.name}
                  {city.admin1 && <span className="text-muted-foreground">, {city.admin1}</span>}
                  <span className="text-muted-foreground"> — {city.country}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
