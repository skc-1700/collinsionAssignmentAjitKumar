import { format, parseISO } from "date-fns";
import { type ActivityRanking } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Waves, Sun, Building2 } from "lucide-react";

const activityIcons: Record<string, React.ReactNode> = {
  Skiing: <Snowflake className="h-4 w-4" />,
  Surfing: <Waves className="h-4 w-4" />,
  "Outdoor Sightseeing": <Sun className="h-4 w-4" />,
  "Indoor Sightseeing": <Building2 className="h-4 w-4" />,
};

function rankColor(rank: number): string {
  if (rank >= 8) return "bg-green-500/15 text-green-700 border-green-500/30";
  if (rank >= 5) return "bg-yellow-500/15 text-yellow-700 border-yellow-500/30";
  return "bg-red-500/15 text-red-700 border-red-500/30";
}

interface RankingResultsProps {
  rankings: ActivityRanking[];
  cityName: string;
}

export function RankingResults({ rankings, cityName }: RankingResultsProps) {
  // Group by date
  const grouped = rankings.reduce<Record<string, ActivityRanking[]>>((acc, r) => {
    (acc[r.date] = acc[r.date] || []).push(r);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-foreground text-center">
        7-Day Activity Ranking for <span className="text-primary">{cityName}</span>
      </h2>
      {dates.map((date) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            {format(parseISO(date), "EEEE, MMM d")}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {grouped[date]
              .sort((a, b) => b.rank - a.rank)
              .map((item) => (
                <Card key={`${date}-${item.activity}`} className="border-border bg-card shadow-sm" aria-label="activity-card">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="shrink-0 text-muted-foreground">{activityIcons[item.activity]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground" aria-label="activity-name">{item.activity}</p>
                      <p className="text-xs text-muted-foreground truncate" aria-label="activity-reasoning">{item.reasoning}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 font-bold text-xs ${rankColor(item.rank)}`} aria-label="activity-rank">
                      {item.rank}/10
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
