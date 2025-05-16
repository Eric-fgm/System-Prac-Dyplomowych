import DropdownMenu from "./dropdown";
import Avatar from "./avatar";
import { useAuthQuery, useLogoutMutation } from "../services/auth";
import { useNavigate } from "react-router";

const UserDropdown = () => {
  const { user } = useAuthQuery();
  const { mutate } = useLogoutMutation();
  const navigate = useNavigate();

  return (
    user && (
      <DropdownMenu
        trigger={
          <Avatar
            name={user.first_name[0] + user.last_name[0]}
            className="cursor-pointer"
          />
        }
        label={{
          name: `${user.first_name} ${user.last_name}`,
          subname: user.email,
        }}
        items={[
          ...(user.supervisor
            ? [{ name: "Panel", onClick: () => navigate("/supervisor-panel") }]
            : []),
          ...(user.is_superuser
            ? [{ name: "Użytkownicy", onClick: () => navigate("/users") }]
            : []),
          { name: "Rezerwacje", onClick: () => navigate("/reservations") },
        ]}
        bottomItem={{
          name: "Wyloguj się",
          onSelect: mutate,
        }}
      />
    )
  );
};

export default UserDropdown;
