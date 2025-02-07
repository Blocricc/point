
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera } from "lucide-react";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const EditPoint = () => {
  const navigate = useNavigate();
  const { projectId, pointId } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { data: point } = useQuery({
    queryKey: ['point', pointId],
    queryFn: () => pointId ? db.points.get(Number(pointId)) : null,
    enabled: !!pointId,
  });

  useEffect(() => {
    if (point) {
      setTitle(point.title);
      setDescription(point.description);
      setPhotoUrl(point.photoUrl || null);
    }
  }, [point]);

  const handlePhotoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      const photoUrl = canvas.toDataURL('image/jpeg');
      setPhotoUrl(photoUrl);

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la capture de la photo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Veuillez remplir le titre");
      return;
    }

    try {
      if (pointId) {
        await db.points.update(Number(pointId), {
          title: title.trim(),
          description: description.trim(),
          photoUrl: photoUrl,
        });
      } else {
        const { x, y, pointNumber } = location.state || {};
        await db.points.add({
          projectId: Number(projectId),
          number: pointNumber,
          x,
          y,
          title: title.trim(),
          description: description.trim(),
          photoUrl: photoUrl,
          createdAt: new Date(),
        });
      }
      toast.success(pointId ? "Point modifié" : "Point ajouté");
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-8 mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate(`/project/${projectId}`)}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-secondary mb-8">
          {pointId ? "Modifier le point" : "Nouveau point"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du point"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="mt-2">
              {photoUrl ? (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={photoUrl}
                    alt="Photo du point"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="absolute bottom-4 right-4"
                    onClick={handlePhotoCapture}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Nouvelle photo
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-64"
                  onClick={handlePhotoCapture}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Prendre une photo
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du point"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
          >
            {pointId ? "Enregistrer les modifications" : "Ajouter le point"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditPoint;
