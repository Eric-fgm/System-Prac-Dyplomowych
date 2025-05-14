import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router";
import Select from "./select";
import { Search } from "lucide-react";
import Input from "./input";

const UsersTopbar = () => {
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
              { name: "Wszyscy użytkownicy", value: "" },
              { name: "Studenci", value: "students" },
              { name: "Promotorzy", value: "supervisors" },
            ]}
            value={searchParams.get("role") ?? ""}
            onChange={(value) => handleSearchParams("role", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersTopbar;
