
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { ProjectCard } from "@/components/ProjectCard";

const Index = () => {
  const navigate = useNavigate();
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.projects.orderBy('createdAt').reverse().toArray()
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/90">
      <div className="container px-4 py-8 mx-auto">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-4">PlanPoint</h1>
          <p className="text-white/80">Gérez vos projets de chantier</p>
        </header>

        <div className="grid gap-6 max-w-2xl mx-auto animate-slideUp">
          <Button
            onClick={() => navigate("/create")}
            size="lg"
            variant="secondary"
            className="w-full bg-white hover:bg-white/90 text-primary"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouveau Projet
          </Button>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              Aucun projet. Créez votre premier projet !
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
