"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type TouristData } from "@/components/tourist-card";
import { cn } from "@/lib/utils";

interface TouristSearchProps {
  tourists: TouristData[];
  className?: string;
  initialQuery?: string;
}

export function TouristSearch({ tourists, className, initialQuery = "" }: TouristSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [filteredTourists, setFilteredTourists] = React.useState<TouristData[]>(tourists);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    status: "all",
    nationality: "all",
    purpose: "all",
    budget: "all"
  });

  // Update search query when initialQuery changes
  React.useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const nationalities = React.useMemo(() => {
    const unique = [...new Set(tourists.map(t => t.nationality))];
    return unique.sort();
  }, [tourists]);

  const searchTourists = React.useCallback((query: string, currentFilters = filters) => {
    if (!query.trim() && currentFilters.status === "all" && currentFilters.nationality === "all" && 
        currentFilters.purpose === "all" && currentFilters.budget === "all") {
      setFilteredTourists(tourists);
      return;
    }

    const filtered = tourists.filter(tourist => {
      const matchesSearch = !query.trim() || 
        tourist.full_name.toLowerCase().includes(query.toLowerCase()) ||
        tourist.digital_id.toLowerCase().includes(query.toLowerCase()) ||
        tourist.documents.passport_number.toLowerCase().includes(query.toLowerCase()) ||
        tourist.contacts.phone_primary.includes(query) ||
        tourist.contacts.email.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = currentFilters.status === "all" || tourist.status === currentFilters.status;
      const matchesNationality = currentFilters.nationality === "all" || tourist.nationality === currentFilters.nationality;
      const matchesPurpose = currentFilters.purpose === "all" || tourist.travel.travel_purpose === currentFilters.purpose;
      const matchesBudget = currentFilters.budget === "all" || tourist.travel.budget_range === currentFilters.budget;

      return matchesSearch && matchesStatus && matchesNationality && matchesPurpose && matchesBudget;
    });

    setFilteredTourists(filtered);
  }, [tourists, filters]);

  React.useEffect(() => {
    searchTourists(searchQuery);
  }, [searchQuery, searchTourists]);


  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    searchTourists(searchQuery, newFilters);
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      nationality: "all", 
      purpose: "all",
      budget: "all"
    });
    searchTourists(searchQuery, {
      status: "all",
      nationality: "all", 
      purpose: "all",
      budget: "all"
    });
  };

  const handleTouristSelect = (tourist: TouristData) => {
    router.push(`/user/${tourist.id}`);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Controls */}
      <div className="space-y-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {searchQuery ? (
              <>Search results for: <span className="font-medium text-foreground">&ldquo;{searchQuery}&rdquo;</span></>
            ) : (
              <>Showing all tourists</>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Nationality</label>
              <select
                value={filters.nationality}
                onChange={(e) => handleFilterChange("nationality", e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">All Nationalities</option>
                {nationalities.map(nationality => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Purpose</label>
              <select
                value={filters.purpose}
                onChange={(e) => handleFilterChange("purpose", e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">All Purposes</option>
                <option value="tourism">Tourism</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Budget</label>
              <select
                value={filters.budget}
                onChange={(e) => handleFilterChange("budget", e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">All Budgets</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredTourists.length} tourist{filteredTourists.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {Object.values(filters).some(f => f !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredTourists.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tourists found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTourists.map((tourist) => (
              <div
                key={tourist.id}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleTouristSelect(tourist)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {tourist.first_name[0]}{tourist.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{tourist.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tourist.digital_id} • {tourist.nationality}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tourist.addresses.find(addr => addr.is_primary)?.city}, {tourist.addresses.find(addr => addr.is_primary)?.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                      tourist.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    )}>
                      {tourist.status}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tourist.travel.travel_purpose}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
