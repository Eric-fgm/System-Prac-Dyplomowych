import { ChevronDown } from "lucide-react";

const Select = ({ items = [], className = "", onChange, ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        className="appearance-none pl-3 pr-8 py-2 w-full border rounded-md text-sm bg-white"
        onChange={(event) => onChange(event.target.value)}
        {...props}
      >
        {items.map(({ name, value }) => (
          <option key={name} value={value}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 pointer-events-none text-gray-400" />
    </div>
  );
};

export default Select;
