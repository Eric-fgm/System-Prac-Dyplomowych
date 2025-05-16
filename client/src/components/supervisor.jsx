import { ExternalLink } from "lucide-react";
import Avatar from "./avatar";
import Button from "./button";
import Badge from "./badge";
import { Link } from "react-router";

const Supervisor = ({ id, specialization, user }) => {
  return (
    <div className="px-4 border-t flex h-20 hover:bg-gray-50">
      <div className="flex sm:basis-[40%] md:basis-[28%] items-center gap-3">
        <Avatar name={`${user.first_name[0]}${user.last_name[0]}`} />
        <div className="font-medium">
          <div className="text-gray-900">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="hidden sm:flex text-sm items-center basis-[18%] lg:basis-[13%]">
        ???
      </div>
      <div className="hidden md:flex flex-wrap items-center gap-1 max-w-[250px]">
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none text-sm whitespace-nowrap">
          {specialization}
        </Badge>
      </div>
      <div className="ml-auto flex gap-2 items-center">
        <Link to={`/?supervisor_id=${id}`}>
          <Button variant="outline" size="sm" className="h-8">
            <ExternalLink className="h-4 w-4" />
            Zobacz tematy
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Supervisor;
