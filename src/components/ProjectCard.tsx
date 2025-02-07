
import { useNavigate } from "react-router-dom";
import { Project } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const ProjectCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      className="w-full bg-white hover:bg-white/90 text-left h-auto p-4 flex items-center justify-between group"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div>
        <h2 className="font-semibold text-primary text-lg">{project.name}</h2>
        <p className="text-secondary text-sm">
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>
      <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
};
