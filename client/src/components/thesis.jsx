import { Link } from "react-router";
import Badge from "./badge";
import Button from "./button";
import { BookOpen } from "lucide-react";
import { parseDate } from "../helpers/utils";
import ThesisQuickViewDialog from "./thesis-quick-view-dialog";
import { useState } from "react";

const Thesis = ({
  id,
  title,
  year,
  department,
  status,
  description,
  category,
  deadline,
  accepted_at,
  supervisor,
  actions,
  withMotivation,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusBadge = () => {
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
    <div className="bg-white rounded-xl p-5 border hover:border-gray-300 transition-all">
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4 items-start">
            <h3
              className="text-lg font-medium text-gray-900 leading-tight hover:underline cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {title}
            </h3>
            {getStatusBadge()}
          </div>
          <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            {year}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="text-gray-700">
            <span className="font-medium">Promotor:</span>{" "}
            {supervisor.user.first_name} {supervisor.user.last_name}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">Kierunek:</span> {department}
          </div>
          {accepted_at && (
            <div className="flex items-center gap-1 text-gray-700">
              <span className="font-medium">Zaakceptowano:</span>{" "}
              {parseDate(accepted_at)}
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-1 text-gray-700">
              <span className="font-medium">Deadline:</span>{" "}
              {deadline ? parseDate(deadline) : "Nieznany"}
            </div>
          )}
        </div>

        <p className="text-gray-600 line-clamp-2 text-sm">{description}</p>

        <div className="flex items-center gap-2">
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none text-xs whitespace-nowrap">
            {category}
          </Badge>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <ThesisQuickViewDialog
              id={id}
              open={open}
              setOpen={setOpen}
              withMotivation={withMotivation}
            />
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setOpen(true)}
            >
              <BookOpen className="h-4 w-4 mr-0.5" />
              Więcej
            </Button>
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thesis;
