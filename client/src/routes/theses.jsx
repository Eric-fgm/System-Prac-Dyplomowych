import { useSearchParams } from "react-router";
import {
  ThesesTopbar,
  Thesis,
  Navigation,
  Pagination,
  ThesisSkeleton,
} from "../components";
import { useThesesQuery } from "../services/theses";

export default function ThesesPage() {
  const [searchParams] = useSearchParams();
  const { theses, isLoading } = useThesesQuery(
    Object.fromEntries(searchParams.entries())
  );

  return (
    <div className="">
      <Navigation />
      <div className="max-w-6xl mt-4 px-4 mx-auto">
        <ThesesTopbar />

        <div className="py-4">
          {isLoading ? (
            <div className="space-y-4">
              <ThesisSkeleton />
              <ThesisSkeleton />
              <ThesisSkeleton />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {theses.map((thesis) => (
                  <Thesis key={thesis.id} {...thesis} />
                ))}
              </div>
              <Pagination className="mt-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
