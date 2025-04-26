import React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({ items = [], value = "", onChange }) => {
  return (
    <div className="relative">
      <select
        className="appearance-none pl-3 pr-8 py-2 border rounded-md text-sm bg-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {items.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 pointer-events-none text-gray-400" />
    </div>
  );
};

export default Select;
