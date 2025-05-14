import { useSearchParams } from "react-router";
import { useUsersQuery } from "../services/users";
import { Pagination, Placeholder, User, UsersTopbar } from "../components";
import UsersSkeleton from "../components/users-skeleton";

const Users = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useUsersQuery(
    Object.fromEntries(searchParams.entries())
  );

  return (
    <>
      <UsersTopbar />

      <div className="py-4">
        {isLoading ? (
          <UsersSkeleton />
        ) : data && data.results.length ? (
          <>
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 flex h-12 items-center text-sm font-medium text-gray-500">
                <div className="sm:basis-[40%] md:basis-[28%]">Użytkownik</div>
                <div className="hidden sm:block basis-[18%] lg:basis-[13%]">
                  Rola
                </div>
                <div className="ml-auto">Akcje</div>
              </div>
              {data.results.map((user) => (
                <User key={user.id} {...user} />
              ))}
            </div>
            <Pagination totalPages={data.total_pages} className="mt-4" />
          </>
        ) : (
          <Placeholder
            title="Nie znaleziono użytkowników"
            description="W repozytorium nie ma obecnie żadnych użytkowników."
          />
        )}
      </div>
    </>
  );
};

export default Users;
