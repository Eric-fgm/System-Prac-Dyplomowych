import { useSearchParams } from "react-router";
import { Search, ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import {
  Thesis,
  Button,
  Navigation,
  Input,
  Pagination,
  ThesisSkeleton,
} from "../components";
import { useThesesQuery } from "../services/theses";

export default function ThesesPage() {
  const [searchParams] = useSearchParams();
  const { theses, isLoading } = useThesesQuery({
    page: searchParams.get("page") ?? "1",
  });

  return (
    <div className="">
      <Navigation />
      <div className="max-w-6xl mt-4 px-4 mx-auto">
        <div className="bg-white rounded-xl p-4 border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by title, author, or keywords..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 border rounded-md text-sm bg-white">
                  <option>Wszystkie stopnie</option>
                  <option>Inżynierskie</option>
                  <option>Magisterskie</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 pointer-events-none text-gray-400" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

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
