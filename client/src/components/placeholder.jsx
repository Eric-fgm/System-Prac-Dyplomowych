import { FileQuestion } from "lucide-react";

const Placeholder = ({ title, description }) => {
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <FileQuestion className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Placeholder;
