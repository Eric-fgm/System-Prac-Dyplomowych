import { useState } from "react";
import Dialog from "./dialog";
import Label from "./label";
import Input from "./input";
import Textarea from "./textarea";
import Button from "./button";
import { useThesisCreateMutation } from "../services/theses";
import { Calendar, FileText, Plus, X } from "lucide-react";
import { useAuthQuery } from "../services/auth";

const CreateThesisDialog = ({ trigger }) => {
  const { user } = useAuthQuery();
  const { mutateAsync } = useThesisCreateMutation();
  const [tags, setTags] = useState([]);
  const [open, setOpen] = useState(false);

  const handleTagAdd = () => {
    setTags([...tags, ""]);
  };

  const handleTagChange = (index, value) => {
    const tagsCopy = [...tags];
    tagsCopy[index] = value;
    setTags(tagsCopy);
  };

  const handleTagRemove = (index) => {
    const tagsCopy = [...tags];
    tagsCopy.splice(index, 1);
    setTags(tagsCopy);
  };

  return (
    !!user?.supervisor && (
      <Dialog
        title="Utwórz pracę"
        description="Submit your information to reserve this thesis topic. Your supervisor will be notified."
        buttonText="Potwierdź"
        trigger={trigger}
        open={open}
        onOpenChange={setOpen}
        onSubmit={(e) => {
          e.preventDefault();
          const fields = {};
          for (var [key, value] of new FormData(e.target)) {
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
              <FileText className="h-4 w-4" />
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
              <Label className="flex items-center gap-1">Promotor</Label>
              <Input
                placeholder="Dr. John Smith"
                value={`${user.first_name} ${user.last_name}`}
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
              <select
                id="department"
                name="department"
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                {["Informatyka"].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
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
                min={new Date().getFullYear()}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Deadline <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deadline"
                name="deadline"
                placeholder="e.g., June 15, 2024"
                required
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
              placeholder="Provide a brief description of the thesis topic..."
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="flex items-center justify-between">
                Tagi <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleTagAdd}
              >
                <Plus className="h-2 w-2" />
                Add Tag
              </Button>
            </div>

            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder="e.g., Artificial Intelligence"
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleTagRemove(tag)}
                    className="h-9 w-9"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    )
  );
};

export default CreateThesisDialog;
