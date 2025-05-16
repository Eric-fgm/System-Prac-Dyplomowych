import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";
import Select from "./select";
import Input from "./input";
import { Search } from "lucide-react";
import { DEPARTMENTS } from "../helpers/constants";
import { useSupervisorsSpecializationsQuery } from "../services/supervisors";

const SupervisorsTopbar = () => {
  const { data: specializations = [] } = useSupervisorsSpecializationsQuery();
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
            placeholder="Wyszukaj po promotora..."
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            items={[{ name: "Wyszystkie kierunki", value: "" }, ...DEPARTMENTS]}
            value={searchParams.get("department") ?? ""}
            onChange={(value) => handleSearchParams("department", value)}
          />
          <Select
            items={[
              { name: "Wszystkie specjalizacje", value: "" },
              ...specializations.map((specialization) => ({
                name: specialization,
              })),
            ]}
            value={searchParams.get("specialization") ?? ""}
            onChange={(value) => handleSearchParams("specialization", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SupervisorsTopbar;
