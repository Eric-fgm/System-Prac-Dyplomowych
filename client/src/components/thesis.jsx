import { Link } from "react-router";
import Badge from "./badge";
import Button from "./button";
import { BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import ReservationDialog from "./reservation-dialog";

const Thesis = ({
  id,
  title,
  year,
  department,
  status,
  description,
  tags,
  supervisor,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "proposed":
        return (
          <Badge className="bg-green-50 text-green-700 border-none font-normal">
            Wolny
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-none font-normal">
            Zarezerwowany
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-none font-normal">
            Zaakceptowany
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
            <Link
              className="text-lg font-medium text-gray-900 leading-tight hover:underline"
              to={`/theses/${id}`}
            >
              {title}
            </Link>
            {getStatusBadge()}
          </div>
          <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            {year}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="text-gray-700">
            <span className="font-medium">Autor:</span>{" "}
            {supervisor.user.first_name} {supervisor.user.last_name}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">Kierunek:</span> {department}
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            <span className="font-medium">Status:</span>{" "}
            {status === "proposed" ? "Wolny" : "Niaznany"}
          </div>
        </div>

        <p className="text-gray-600 line-clamp-2 text-sm">{description}</p>

        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {(tags ?? []).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4 mr-0.5" />
            Podgląd
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <BookOpen className="h-4 w-4 mr-0.5" />
              Więcej
            </Button>

            {status === "proposed" && (
              <ReservationDialog
                id={id}
                title={title}
                supervisor={supervisor}
                year={year}
                trigger={
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    //   onClick={() => openReservationModal(thesis)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-0.5" />
                    Rezerwuj
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thesis;
