import Badge from "./badge";
import Dialog from "./dialog";
import Avatar from "./avatar";
import { useSingleThesisQuery } from "../services/theses";
import { Calendar, CheckCheck, Clock, User } from "lucide-react";
import { parseDate } from "../helpers/utils";

const ThesisQuickViewDialog = ({ id, withMotivation, open, setOpen }) => {
  const { data: thesis, isPending } = useSingleThesisQuery(id, {
    enabled: open,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-50 text-green-700 border-none font-normal">
            Wolny
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-none font-normal">
            W trakcie
          </Badge>
        );
      case "defended":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-none font-normal">
            Obroniony
          </Badge>
        );
      case "waiting":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-none font-normal">
            Oczekuje
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      title={thesis ? thesis.title : ""}
      size="lg"
      closeButtonText="Zamknij"
      open={open}
      onOpenChange={setOpen}
    >
      {isPending ? (
        <ThesisQuickViewDialogSkeleton />
      ) : (
        thesis && (
          <div className="space-y-6">
            {/* Status and metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                {getStatusBadge(thesis.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-gray-500" />
                <span>
                  {thesis.supervisor.user.first_name}{" "}
                  {thesis.supervisor.user.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{thesis.year}</span>
              </div>
              {thesis.accepted_at && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCheck className="h-4 w-4 text-gray-500" />
                  <span>{parseDate(thesis.accepted_at)}</span>
                </div>
              )}
              {thesis.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{parseDate(thesis.deadline)}</span>
                </div>
              )}
            </div>

            {thesis.applicant && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">
                  Student realizujący temat
                </h3>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar
                    name={`${thesis.applicant.first_name[0]}${thesis.applicant.last_name[0]}`}
                    className="h-10 w-10 border border-gray-200"
                  />

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {thesis.applicant.first_name} {thesis.applicant.last_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>???</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {withMotivation && thesis.motivation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Motywacja</h3>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {thesis.motivation}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">Kategoria</h3>
              </div>
              <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none">
                {thesis.category}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Opis</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {thesis.description}
              </p>
            </div>
          </div>
        )
      )}
    </Dialog>
  );
};

const ThesisQuickViewDialogSkeleton = () => {
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ThesisQuickViewDialog;
