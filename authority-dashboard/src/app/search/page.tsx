"use client";

import { Search } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { TouristSearch } from "@/components/tourist-search";
import { type TouristData } from "@/components/tourist-card";
import mockTouristsData from "@/data/mock-tourists.json";
import { useState } from "react";

export default function SearchPage() {
  const tourists: TouristData[] = mockTouristsData.tourists;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              TOURIST SEARCH
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search for tourists by name, digital ID, passport number, or phone number.
            Real-time lookup with comprehensive tourist information.
          </p>
        </div>

        {/* Animated Search Bar */}
        <div className="flex justify-center">
          <SearchBar 
            placeholder="Search tourists by name, ID, passport, or phone..."
            onSearch={handleSearch}
            tourists={tourists}
          />
        </div>

        {/* Tourist Search Results */}
        <TouristSearch 
          tourists={tourists}
          initialQuery={searchQuery}
        />
      </div>
    </div>
  );
}
