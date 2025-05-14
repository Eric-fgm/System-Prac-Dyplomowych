import Avatar from "./avatar";
import ManageUserDropdown from "./manage-user-dropdown";

const User = ({ id, first_name, last_name, email, supervisor }) => {
  return (
    <div className="px-4 border-t flex h-20 hover:bg-gray-50">
      <div className="flex sm:basis-[40%] md:basis-[28%] items-center gap-3">
        <Avatar name={`${first_name[0]}${last_name[0]}`} />
        <div className="font-medium">
          <div className="text-gray-900">
            {first_name} {last_name}
          </div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
      <div className="hidden sm:flex items-center basis-[18%] lg:basis-[13%]">
        {supervisor ? "Promotor" : "Student"}
      </div>

      <div className="ml-auto flex gap-2 items-center">
        <ManageUserDropdown id={id} supervisor={supervisor} />
      </div>
    </div>
  );
};

export default User;
