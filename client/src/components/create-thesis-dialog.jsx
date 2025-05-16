import { useState } from "react";
import Dialog from "./dialog";
import Label from "./label";
import Input from "./input";
import Textarea from "./textarea";
import { useThesisCreateMutation } from "../services/theses";
import { useAuthQuery } from "../services/auth";
import Select from "./select";
import { DEPARTMENTS } from "../helpers/constants";

const CreateThesisDialog = ({ trigger }) => {
  const { user } = useAuthQuery();
  const { mutateAsync, isPending } = useThesisCreateMutation();
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    !!user?.supervisor && (
      <Dialog
        title="Utwórz pracę"
        description="Prześlij dane, aby utworzyć nowy temat pracy."
        buttonText="Potwierdź"
        trigger={trigger}
        open={open}
        onOpenChange={setOpen}
        isSubmitting={isPending}
        onSubmit={(e) => {
          e.preventDefault();
          const fields = {};
          for (var [key, value] of new FormData(e.target)) {
            if (!value) continue;
            fields[key] = key === "year" ? parseInt(value, 10) : value;
          }

          mutateAsync(fields)
            .then(() => setOpen(false))
            .catch(() => {});
        }}
      >
        <div className="space-y-4">
          {/* Thesis Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1">
              Tytuł <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Wprowadź tytuł"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-1">
                Kategoria <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                name="category"
                placeholder="Wprowadź kategorie"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kind" className="flex items-center gap-1">
                Stopień <span className="text-red-500">*</span>
              </Label>
              <Select
                id="kind"
                name="kind"
                placeholder="Wybierz stopień"
                items={[
                  { name: "Licencjackie", value: "bachelor" },
                  { name: "Inżynierskie", value: "engineering" },
                  { name: "Magisterskie", value: "master" },
                ]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Promotor</Label>
              <Input
                placeholder="Dr. John Smith"
                value={`${user.first_name} ${user.last_name} (Ty)`}
                disabled
              />
              <input
                name="supervisor_id"
                value={user.supervisor.id}
                type="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                Kierunek <span className="text-red-500">*</span>
              </Label>
              <Select
                id="department"
                name="department"
                items={DEPARTMENTS}
                className="max-w-full"
              />
            </div>
          </div>

          {/* Year and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">
                Rok <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={currentYear}
                defaultValue={currentYear}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="flex items-center gap-1">
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Opis <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Podaj opis tematu pracy dyplomowej..."
              rows={8}
              required
            />
          </div>
        </div>
      </Dialog>
    )
  );
};

export default CreateThesisDialog;
