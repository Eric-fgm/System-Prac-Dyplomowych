import React from "react";
import { useAuthQuery } from "../services/auth";
import { useSearchParams } from "react-router";
import { useThesesQuery } from "../services/theses";
import { Pagination, Placeholder, Thesis, ThesisSkeleton } from "../components";

const ReservationsPage = () => {
  const { user } = useAuthQuery();
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useThesesQuery({
    user_id: user?.id,
    ...Object.fromEntries(searchParams.entries()),
  });

  return (
    <>
      <div className="py-4">
        {isLoading ? (
          <div className="space-y-4">
            <ThesisSkeleton />
            <ThesisSkeleton />
            <ThesisSkeleton />
          </div>
        ) : data && data.results.length ? (
          <>
            <div className="space-y-4">
              {data.results.map((thesis) => (
                <Thesis key={thesis.id} {...thesis} withMotivation />
              ))}
            </div>
            <Pagination totalPages={data.total_pages} className="mt-4" />
          </>
        ) : (
          <Placeholder
            title="Nie znaleziono rezerwacji"
            description="W repozytorium nie ma obecnie żadnej rezerwacji."
          />
        )}
      </div>
    </>
  );
};

export default ReservationsPage;
