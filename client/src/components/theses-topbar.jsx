import { Search, Filter } from "lucide-react";
import Button from "./button";
import Input from "./input";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Select from "./select";
import { useDebounce } from "use-debounce";
import { DEPARTMENTS } from "../helpers/constants";
import { useThesesCategoriesQuery } from "../services/theses";
import { useSupervisorsQuery } from "../services/supervisors";

const ThesesTopbar = () => {
  const { data: categories = [] } = useThesesCategoriesQuery();
  const { data } = useSupervisorsQuery({ per_page: 999 });
  const [areFilterOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [debouncedValue] = useDebounce(query, 250);

  const handleSearchParams = (key, value) => {
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    searchParams.delete("page");

    setSearchParams(new URLSearchParams(searchParams));
  };

  useEffect(() => {
    handleSearchParams("search", debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Wyszukaj po tytule, autorze lub słowach kluczowych..."
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            items={[
              { name: "Wszystkie stopnie", value: "" },
              { name: "Licencjackie", value: "bachelor" },
              { name: "Inżynierskie", value: "engineering" },
              { name: "Magisterskie", value: "master" },
            ]}
            value={searchParams.get("kind") ?? ""}
            onChange={(value) => handleSearchParams("kind", value)}
          />
          <Button
            variant="outline"
            size="icon"
            className={`${areFilterOpen ? "bg-accent" : ""}`}
            onClick={() => setFiltersOpen((p) => !p)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {areFilterOpen && (
        <div className="mt-4 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
          <Select
            items={[
              { name: "Wolny", value: "" },
              { name: "W trakcie realizacji", value: "in_progress" },
              { name: "Obroniony", value: "defended" },
            ]}
            value={searchParams.get("status") ?? ""}
            onChange={(value) => handleSearchParams("status", value)}
          />
          <Select
            items={[
              { name: "Wyszyscy", value: "" },
              ...(data
                ? data.results.map(({ id, user }) => ({
                    name: `${user.first_name} ${user.last_name}`,
                    value: id,
                  }))
                : []),
            ]}
            value={searchParams.get("supervisor_id") ?? ""}
            onChange={(value) => handleSearchParams("supervisor_id", value)}
          />
          <Select
            items={[
              { name: "Wyszystkie kategorie", value: "" },
              ...categories.map((category) => ({ name: category })),
            ]}
            value={searchParams.get("category") ?? ""}
            onChange={(value) => handleSearchParams("category", value)}
          />
          <Select
            items={[{ name: "Wyszystkie kierunki", value: "" }, ...DEPARTMENTS]}
            value={searchParams.get("department") ?? ""}
            onChange={(value) => handleSearchParams("department", value)}
          />
        </div>
      )}
    </div>
  );
};

export default ThesesTopbar;
