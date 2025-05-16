import { useSearchParams } from "react-router";
import {
  ThesesTopbar,
  Thesis,
  Pagination,
  ThesisSkeleton,
  Placeholder,
  Button,
} from "../components";
import { useThesesQuery } from "../services/theses";
import ReservationDialog from "../components/reservation-dialog";
import { CheckCircle2 } from "lucide-react";

export default function ThesesPage() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useThesesQuery({
    status: "available",
    ...Object.fromEntries(searchParams.entries()),
  });

  return (
    <>
      <ThesesTopbar />

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
                <Thesis
                  key={thesis.id}
                  {...thesis}
                  actions={
                    thesis.status === "available" && (
                      <ReservationDialog
                        {...thesis}
                        trigger={
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-0.5" />
                            Rezerwuj
                          </Button>
                        }
                      />
                    )
                  }
                />
              ))}
            </div>
            <Pagination totalPages={data.total_pages} className="mt-4" />
          </>
        ) : (
          <Placeholder
            title="Nie znaleziono prac dyplomowych"
            description="W repozytorium nie ma obecnie żadnych prac dyplomowych."
          />
        )}
      </div>
    </>
  );
}
