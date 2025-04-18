import { Link } from "react-router";
import Avatar from "./avatar";

const Navigation = () => {
  return (
    <div className="border-b">
      <div className="mx-auto flex h-16 items-center max-w-6xl px-4">
        <Link to="/" className="mr-8 text-base font-medium">
          Dyplom
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            to="/examples/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Tematy
          </Link>
          <Link
            to="/examples/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Promotorzy
          </Link>
        </nav>
        <div className="ml-auto">
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
