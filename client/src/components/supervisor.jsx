import { ChevronDown, ExternalLink } from "lucide-react";
import Avatar from "./avatar";
import Button from "./button";
import Badge from "./badge";
import { Link } from "react-router";

const Supervisor = ({ id, specialization, user }) => {
  return (
    <div className="px-4 border-t flex h-20 hover:bg-gray-50">
      <div className="flex basis-[28%] items-center gap-3">
        <Avatar name={`${user.first_name[0]}${user.last_name[0]}`} />
        <div className="font-medium">
          <div className="text-gray-900">{user.first_name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="flex items-center basis-[11%]">{specialization}</div>
      <div className="flex flex-wrap items-center gap-1 max-w-[250px]">
        {["Machine Learning"].map((exp) => (
          <Badge
            key={exp}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none text-xs whitespace-nowrap"
          >
            {exp}
          </Badge>
        ))}
      </div>
      <div className="ml-auto flex gap-2 items-center">
        <Button variant="ghost" size="sm" className="h-8 text-gray-700">
          More
          <ChevronDown className="h-4 w-4 transition-transform" />
        </Button>
        <Link href={`/supervisors/${id}`}>
          <Button variant="outline" size="sm" className="h-8">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Supervisor;
