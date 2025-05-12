import { Link } from "react-router";
import UserDropdown from "./user-dropdown";
import Button from "./button";
import CreateThesisDialog from "./create-thesis-dialog";

const Navigation = () => {
  return (
    <div className="border-b">
      <div className="mx-auto flex h-16 items-center max-w-6xl px-4">
        <Link to="/" className="mr-8 text-base font-medium">
          Dyplom
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            to="/"
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
        <div className="flex gap-x-4 ml-auto">
          <CreateThesisDialog
            trigger={<Button size="sm">Dodaj pracę</Button>}
          />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
