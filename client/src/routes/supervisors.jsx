import { useSearchParams } from "react-router";
import { Pagination, Placeholder, Supervisor } from "../components";
import SupervisorsSkeleton from "../components/supervisors-skeleton";
import SupervisorsTopbar from "../components/supervisors-topbar";
import { useSupervisorsQuery } from "../services/supervisors";

const SupervisorsPage = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useSupervisorsQuery(
    Object.fromEntries(searchParams.entries())
  );

  return (
    <>
      <SupervisorsTopbar />

      {isLoading ? (
        <SupervisorsSkeleton />
      ) : data && data.results.length ? (
        <>
          <div className="mt-4 bg-white rounded-xl border overflow-hidden">
            <div className="px-4 flex h-12 items-center text-sm font-medium text-gray-500">
              <div className="sm:basis-[40%] md:basis-[28%]">Promotor</div>
              <div className="hidden sm:block basis-[18%] lg:basis-[13%]">
                Kierunek
              </div>
              <div className="hidden md:block ">Specjalizacja</div>
              <div className="ml-auto">Akcje</div>
            </div>
            {data.results.map((supervisor) => (
              <Supervisor key={supervisor.id} {...supervisor} />
            ))}
          </div>
          <Pagination totalPages={data.total_pages} className="mt-4" />
        </>
      ) : (
        <Placeholder
          title="Nie znaleziono promotorów"
          description="W repozytorium nie ma obecnie żadnych prac dyplomowych."
        />
      )}
    </>
  );
};

export default SupervisorsPage;
