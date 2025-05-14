import {
  useCreateSupervisorMutation,
  useRemoveSupervisorMutation,
} from "../services/supervisors";
import Button from "./button";
import DropdownMenu from "./dropdown";
import { Ellipsis } from "lucide-react";

const ManageUserDropdown = ({ id, supervisor }) => {
  const { mutate: createSupervisor } = useCreateSupervisorMutation();
  const { mutate: removeSupervisor } = useRemoveSupervisorMutation();

  return (
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm" className="h-8">
          <Ellipsis className="h-4 w-4" />
        </Button>
      }
      items={
        supervisor
          ? [
              {
                name: "Usuń promotorstwo",
                onClick: () => removeSupervisor(supervisor),
              },
            ]
          : [
              {
                name: "Oznacz promotora",
                onClick: () =>
                  createSupervisor({
                    user_id: id,
                    specialization: "Informatyka",
                  }),
              },
            ]
      }
    />
  );
};

export default ManageUserDropdown;
