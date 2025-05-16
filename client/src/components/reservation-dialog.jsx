import { Calendar, Clock, GraduationCap, Tag, User } from "lucide-react";
import Dialog from "./dialog";
import Label from "./label";
import Textarea from "./textarea";
import { useThesisReservationMutation } from "../services/theses";
import { useState } from "react";
import { parseDate } from "../helpers/utils";

const ReservationDialog = ({
  id,
  trigger,
  title,
  supervisor,
  category,
  department,
  deadline,
}) => {
  const { mutateAsync, isPending } = useThesisReservationMutation(id);
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      title="Zapisz się"
      description="Prześlij swoje dane, aby zarezerwować ten temat pracy dyplomowej."
      buttonText="Potwierdź"
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      isSubmitting={isPending}
      onSubmit={(e) => {
        e.preventDefault();
        const fields = {};
        for (var [key, value] of new FormData(e.target)) {
          fields[key] = value;
        }

        mutateAsync(fields)
          .then(() => setOpen(false))
          .catch(() => {});
      }}
    >
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
          <User className="h-4 w-4" />
          <span>
            Promotor: {supervisor.user.first_name} {supervisor.user.last_name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
          <GraduationCap className="h-4 w-4" />
          <span>Kierunek: {department}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
          <Tag className="h-4 w-4" />
          <span>Kategoria: {category}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Deadline: {deadline ? parseDate(deadline) : "Nieznany"}</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="motivation">
          Motywacja{" "}
          <span className="text-sm text-gray-500">
            (Dlaczego jesteś zainteresowany?)
          </span>
        </Label>
        <Textarea
          id="motivation"
          name="motivation"
          placeholder="Opisz swoją motywację"
          rows={4}
        />
      </div>
    </Dialog>
  );
};

export default ReservationDialog;
