import { useState } from "react";
import { useAuthQuery, useRegisterMutation } from "../services/auth";
import Dialog from "./dialog";
import Label from "./label";
import Input from "./input";
import { Plus, Tag, X } from "lucide-react";
import Button from "./button";

const CreateUserDialog = ({ trigger }) => {
  const { user } = useAuthQuery();
  const { mutateAsync, isPending } = useRegisterMutation();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);

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
    !!user?.is_superuser && (
      <Dialog
        title="Utwórz użytkownika"
        description="Submit your information to reserve this thesis topic. Your supervisor will be notified."
        buttonText="Potwierdź"
        trigger={trigger}
        isSubmitting={isPending}
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
        {/* <div className="flex items-center gap-4">
          <Avatar />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700">
              Profile Picture
            </h3>
            <p className="text-sm text-gray-500">
              A default avatar will be assigned to the new user.
            </p>
          </div>
        </div> */}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="flex items-center gap-1">
                Imię <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Podaj imię"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="flex items-center gap-1">
                Nazwisko <span className="text-red-500">*</span>
              </Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Podaj nazwisko"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jan.kowalski@agh.edu.pl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-1">
              Hasło <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Nowe hasło"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-1">
                Kierunek <span className="text-red-500">*</span>
              </Label>
              <select
                id="department"
                name="department"
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              >
                {["Informatyka"].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="availableSlots"
                className="flex items-center gap-1"
              >
                Liczba wolnych miejsc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="availableSlots"
                name="availableSlots"
                type="number"
                min="1"
                max="20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tagi
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleTagAdd}
              >
                <Plus className="h-3 w-3 mr-1" />
                Dodaj tag
              </Button>
            </Label>

            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder="e.g., Artificial Intelligence"
                    className="flex-1"
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

          {/* <div className="space-y-2">
            <Label htmlFor="bio">
              Biography <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Provide a brief biography and research interests..."
              rows={4}
            />
          </div> */}
        </div>
      </Dialog>
    )
  );
};

export default CreateUserDialog;
