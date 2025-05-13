import { Calendar } from "lucide-react";
import Dialog from "./dialog";
import Label from "./label";
import Textarea from "./textarea";
import { useThesisReservationMutation } from "../services/theses";
import { useState } from "react";

const ReservationDialog = ({ trigger, id, title, supervisor, year }) => {
  const { mutateAsync } = useThesisReservationMutation(id);
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      title="Zapisz się"
      description="Submit your information to reserve this thesis topic. Your supervisor will be notified."
      buttonText="Potwierdź"
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
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
        <p className="text-sm text-gray-600 mt-1">
          Autor: {supervisor.user.first_name} {supervisor.user.last_name}
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Deadline: 16 Mar {year}</span>
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
          required
        />
      </div>
    </Dialog>
  );
};

export default ReservationDialog;
