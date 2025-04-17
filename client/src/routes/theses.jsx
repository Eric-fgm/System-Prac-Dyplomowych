import { Search, ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import { Badge, Button, Navigation, Input, Pagination } from "../components";

const theses = [
  {
    id: "1",
    title: "The Impact of Artificial Intelligence on Modern Healthcare Systems",
    author: "Dr. Sarah Johnson",
    status: "Zaakceptowany",
    department: "Informatyka",
    year: 2024,
    abstract:
      "This thesis explores how AI technologies are transforming healthcare delivery, patient outcomes, and medical research. Through case studies and data analysis, it examines both the benefits and challenges of AI integration in clinical settings.",
    tags: ["Artificial Intelligence", "Healthcare", "Technology"],
    createdAt: "17.04.2025",
  },
  {
    id: "2",
    title:
      "Sustainable Urban Planning: Balancing Growth and Environmental Conservation",
    author: "Prof. Michael Chen",
    status: "Wolny",
    year: 2025,
    department: "Informatyka",
    abstract:
      "An analysis of sustainable urban development strategies that balance population growth demands with environmental conservation. The research presents new frameworks for city planners to minimize ecological footprints while supporting economic development.",
    tags: ["Urban Planning", "Sustainability", "Environment"],
    createdAt: "17.04.2025",
  },
];

export default function Thesis() {
  return (
    <div className="">
      <Navigation />
      <div className="max-w-6xl mt-4 px-4 mx-auto">
        <div className="bg-white rounded-xl p-4 border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by title, author, or keywords..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border rounded-md text-sm bg-white"
                  // value={selectedDepartment}
                  // onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option>Wszystkie</option>
                  {/* {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))} */}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 pointer-events-none text-gray-400" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {theses.map((thesis) => (
            <div
              key={thesis.id}
              className="bg-white rounded-xl p-5 border hover:border-gray-300 transition-all"
            >
              <div className="space-y-4">
                {/* Title and year */}
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-medium text-gray-900 leading-tight">
                    {thesis.title}
                  </h3>
                  <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    {thesis.year}
                  </div>
                </div>

                {/* Author and department */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium">Author:</span> {thesis.author}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Department:</span>{" "}
                    {thesis.department}
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <span className="font-medium">Status:</span> {thesis.status}
                  </div>
                </div>

                {/* Abstract preview */}
                <p className="text-gray-600 line-clamp-2 text-sm">
                  {thesis.abstract}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-2">
                    {thesis.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {/* <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View details
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>
        <Pagination className="py-4" />
      </div>
    </div>
  );
}
