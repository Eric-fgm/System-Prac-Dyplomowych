import { Placeholder, Supervisor } from "../components";
import { useSupervisorsQuery } from "../services/supervisors";

const SupervisorsPage = () => {
  const { supervisors, isLoading } = useSupervisorsQuery();

  return isLoading ? (
    "Loading..."
  ) : supervisors.length ? (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-4 flex h-12 items-center text-sm font-medium text-gray-500">
        <div className="basis-[28%]">Promotor</div>
        <div className="basis-[11%]">Kierunek</div>
        <div>Expertise</div>
        <div className="ml-auto">Akcje</div>
      </div>
      {supervisors.map((supervisor) => (
        <Supervisor key={supervisor.id} {...supervisor} />
      ))}
    </div>
  ) : (
    <Placeholder
      title="Nie znaleziono promotorów"
      description="W repozytorium nie ma obecnie żadnych prac dyplomowych."
    />
  );
};

export default SupervisorsPage;
