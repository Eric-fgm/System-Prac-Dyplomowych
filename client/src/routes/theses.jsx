import { useSearchParams } from "react-router";
import {
  ThesesTopbar,
  Thesis,
  Pagination,
  ThesisSkeleton,
  Placeholder,
} from "../components";
import { useThesesQuery } from "../services/theses";

export default function ThesesPage() {
  const [searchParams] = useSearchParams();
  const { theses, isLoading } = useThesesQuery(
    Object.fromEntries(searchParams.entries())
  );

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
        ) : theses.length ? (
          <>
            <div className="space-y-4">
              {theses.map((thesis) => (
                <Thesis key={thesis.id} {...thesis} />
              ))}
            </div>
            <Pagination className="mt-4" />
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
