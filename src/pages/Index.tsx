import { useState } from "react";
import { CitySearch } from "@/components/CitySearch";
import { RankingResults } from "@/components/RankingResults";
import { getActivityRankings, type GeoResult, type ActivityRanking } from "@/lib/api";
import { Loader2, Mountain } from "lucide-react";

const Index = () => {
  const [rankings, setRankings] = useState<ActivityRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCitySelect = async (city: GeoResult) => {
    setLoading(true);
    setError("");
    setSelectedCity(`${city.name}, ${city.country}`);
    try {
      const data = await getActivityRankings(city.latitude, city.longitude);
      setRankings(data);
    } catch {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Mountain className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Activity Ranking
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Search a city to get a 7-day weather-based activity ranking
          </p>
        </div>

        {/* Search */}
        <CitySearch onSelect={handleCitySelect} />

        {/* States */}
        {loading && (
          <div className="flex justify-center py-12" aria-label="loading-spinner">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-destructive" aria-label="error-message">{error}</p>
        )}

        {!loading && !error && rankings.length > 0 && (
          <RankingResults rankings={rankings} cityName={selectedCity} />
        )}
      </div>
    </div>
  );
};

export default Index;
