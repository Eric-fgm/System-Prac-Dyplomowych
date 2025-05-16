import { Trash } from "lucide-react";
import {
  Button,
  Pagination,
  Placeholder,
  Select,
  Thesis,
  ThesisSkeleton,
} from "../components";
import { useAuthQuery } from "../services/auth";
import {
  useThesesQuery,
  useThesisActionMutation,
  useThesisRemoveMutation,
} from "../services/theses";
import { useSearchParams } from "react-router";

const SupervisorPanelPage = () => {
  const { user } = useAuthQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useThesesQuery({
    supervisor_id: user?.supervisor?.id,
    ...Object.fromEntries(searchParams.entries()),
  });

  const handleSearchParams = (key, value) => {
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    searchParams.delete("page");

    setSearchParams(new URLSearchParams(searchParams));
  };

  return (
    <>
      <Select
        items={[
          { name: "Wszystkie", value: "" },
          { name: "Wolny", value: "available" },
          { name: "Oczekujące", value: "waiting" },
          { name: "W trakcie realizacji", value: "in_progress" },
          { name: "Obroniony", value: "defended" },
        ]}
        value={searchParams.get("status") ?? ""}
        onChange={(value) => handleSearchParams("status", value)}
        className="w-fit"
      />
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
                <ThesisWithActions key={thesis.id} {...thesis} />
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
};

const ThesisWithActions = (props) => {
  const { id, status } = props;
  const { mutate: changeStatus, isPending } = useThesisActionMutation(id);
  const { mutate: removeThesis, isPending: isRemoving } =
    useThesisRemoveMutation();

  return (
    <Thesis
      key={id}
      {...props}
      actions={
        <>
          {status === "waiting" && (
            <>
              <Button
                size="sm"
                className="bg-orange-400 hover:bg-orange-500 text-white"
                onClick={() => changeStatus("reject")}
                disabled={isPending}
              >
                Odrzuć
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => changeStatus("accept")}
                disabled={isPending}
              >
                Akceptuj
              </Button>
            </>
          )}
          {status === "available" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeThesis(id)}
              disabled={isRemoving}
            >
              <Trash className="w-4 h-4" /> Usuń
            </Button>
          )}
        </>
      }
      withMotivation
    />
  );
};

export default SupervisorPanelPage;
