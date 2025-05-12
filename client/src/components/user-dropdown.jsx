import DropdownMenu from "./dropdown";
import Avatar from "./avatar";
import { useAuthQuery, useLogoutMutation } from "../services/auth";

const UserDropdown = () => {
  const { user } = useAuthQuery();
  const { mutate } = useLogoutMutation();

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
        items={[{ name: "Profil" }, { name: "Rezerwacje" }]}
        bottomItem={{
          name: "Wyloguj się",
          onSelect: mutate,
        }}
      />
    )
  );
};

export default UserDropdown;
