import { NavLink } from "react-router";
import UserDropdown from "./user-dropdown";
import Button from "./button";
import CreateThesisDialog from "./create-thesis-dialog";
import CreateUserDialog from "./create-user-dialog";

const Navigation = () => {
  return (
    <div className="sticky top-0 border-b bg-white z-10">
      <div className="mx-auto flex h-16 items-center max-w-6xl px-4">
        <NavLink to="/" className="mr-12 text-lg font-medium">
          Dyplom
        </NavLink>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {[
            { name: "Tematy prac", href: "/" },
            { name: "Promotorzy", href: "/supervisors" },
          ].map(({ name, href }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  !isActive &&
                  "text-muted-foreground transition-colors hover:text-primary"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-x-4 ml-auto">
          <CreateThesisDialog
            trigger={<Button size="sm">Dodaj pracę</Button>}
          />
          <CreateUserDialog
            trigger={<Button size="sm">Dodaj użytkownika</Button>}
          />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
