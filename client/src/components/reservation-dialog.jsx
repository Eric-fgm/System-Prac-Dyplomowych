import { Calendar } from "lucide-react";
import Dialog from "./dialog";
import Label from "./label";
import Textarea from "./textarea";
import { useThesisReservationMutation } from "../services/theses";

const ReservationDialog = ({ trigger, id, title, supervisor, deadline }) => {
  const { mutate } = useThesisReservationMutation(id);

  return (
    <Dialog
      title="Reserve Thesis"
      description="Submit your information to reserve this thesis topic. Your supervisor will be notified."
      buttonText="Potwierdź rezerwację"
      trigger={trigger}
      onSubmit={(e) => {
        e.preventDefault();
        const fields = {};
        for (var [key, value] of new FormData(e.target)) {
          fields[key] = value;
        }

        mutate(fields);
      }}
    >
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">Supervisor: {supervisor}</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Deadline: {deadline}</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="motivation">
          Motivation{" "}
          <span className="text-sm text-gray-500">
            (Why are you interested in this thesis?)
          </span>
        </Label>
        <Textarea
          id="motivation"
          name="motivation"
          placeholder="Briefly describe why you're interested in this thesis topic and your relevant experience..."
          rows={4}
          required
        />
      </div>
    </Dialog>
  );
};

export default ReservationDialog;
