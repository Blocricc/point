
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Target, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db, Point } from "@/lib/db";
import { PointMarker } from "@/components/PointMarker";
import { toast } from "sonner";

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => db.projects.get(Number(id)),
  });

  const { data: points = [] } = useQuery({
    queryKey: ['points', id],
    queryFn: () => db.points.where('projectId').equals(Number(id)).toArray(),
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.1), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddPoint = () => {
    if (!containerRef.current || !project?.id) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = (rect.width / 2 - position.x) / scale;
    const centerY = (rect.height / 2 - position.y) / scale;

    navigate(`/project/${project.id}/point`, {
      state: { x: centerX, y: centerY, pointNumber: points.length + 1 },
    });
  };

  const handleDeletePoint = async (pointId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce point ?")) {
      return;
    }

    try {
      await db.points.delete(pointId);
      await queryClient.invalidateQueries({ queryKey: ['points', id] });
      toast.success("Point supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du point");
    }
  };

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-secondary">{project.name}</h1>
          <div className="w-[100px]" />
        </div>

        <div className="flex gap-8">
          <div
            ref={containerRef}
            className="relative flex-1 h-[calc(100vh-12rem)] overflow-hidden border rounded-lg bg-gray-50"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={project.planUrl}
              alt="Plan"
              className="absolute transform origin-top-left cursor-move"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
            />
            {points.map((point) => (
              <PointMarker
                key={point.id}
                point={point}
                scale={scale}
                position={position}
                onClick={() => navigate(`/project/${project.id}/point/${point.id}`)}
              />
            ))}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Target className="w-8 h-8 text-primary/50" />
            </div>
          </div>

          <div className="w-80">
            <Button
              onClick={handleAddPoint}
              className="w-full mb-4 bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un point
            </Button>

            <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border p-4">
              {points.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun point. Cliquez sur le plan pour ajouter un point.
                </div>
              ) : (
                <div className="space-y-2">
                  {points.map((point) => (
                    <div key={point.id} className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 justify-start h-auto py-3"
                        onClick={() => navigate(`/project/${project.id}/point/${point.id}`)}
                      >
                        <div className="mr-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                          {point.number}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{point.title}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {point.description}
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => point.id && handleDeletePoint(point.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;

