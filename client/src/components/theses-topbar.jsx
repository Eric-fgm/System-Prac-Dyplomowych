import { Search, ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import Button from "./button";
import Input from "./input";
import { useSearchParams } from "react-router";
import { useState } from "react";
import Select from "./select";

const ThesesTopbar = () => {
  const [areFilterOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchParams = (key, value) => {
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    setSearchParams(new URLSearchParams(searchParams));
  };

  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by title, author, or keywords..."
            className="pl-9"
            defaultValue={searchParams.get("query")}
          />
        </div>
        <div className="flex gap-2">
          <Select
            items={[
              { name: "Wszystkie stopnie", value: "" },
              { name: "Licencjackie", value: "bachelor" },
              { name: "Inżynierskie", value: "engineer" },
              { name: "Magisterskie", value: "master" },
            ]}
            value={searchParams.get("degree") ?? ""}
            onChange={(value) => handleSearchParams("degree", value)}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFiltersOpen((p) => !p)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {areFilterOpen && (
        <div className="mt-4 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
          <Select
            items={[
              { name: "Wszystkie statusy", value: "" },
              { name: "Otwarty", value: "open" },
              { name: "Zaakceptowany", value: "accepted" },
              { name: "W trakcie realizacji", value: "in-progress" },
              { name: "Zakończony", value: "closed" },
            ]}
            value={searchParams.get("status") ?? ""}
            onChange={(value) => handleSearchParams("status", value)}
          />
          <Select
            items={[
              { name: "Wyszyscy", value: "" },
              { name: "Jan Kowalski", value: "1" },
              { name: "Adam Nowak", value: "2" },
            ]}
            value={searchParams.get("promoter") ?? ""}
            onChange={(value) => handleSearchParams("promoter", value)}
          />
          <Select
            items={[
              { name: "Wyszystkie tagi", value: "" },
              { name: "Technology", value: "technology" },
              { name: "Healthcare", value: "healthcare" },
            ]}
            value={searchParams.get("tags") ?? ""}
            onChange={(value) => handleSearchParams("tags", value)}
          />
          <Select
            items={[
              { name: "Wyszystkie kierunki", value: "" },
              { name: "Informatyka", value: "computer-science" },
              { name: "Analiza danych", value: "data-analytics" },
            ]}
            value={searchParams.get("department") ?? ""}
            onChange={(value) => handleSearchParams("department", value)}
          />
        </div>
      )}
    </div>
  );
};

export default ThesesTopbar;
