
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import { db } from "@/lib/db";
import { toast } from "sonner";

const CreateProject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlanFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !planFile) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const planUrl = URL.createObjectURL(planFile);
      const project = await db.projects.add({
        name: name.trim(),
        planUrl,
        createdAt: new Date(),
      });
      toast.success("Projet créé avec succès");
      navigate(`/project/${project}`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création du projet");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-8 mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-secondary mb-8">
          Nouveau Projet
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon projet"
            />
          </div>

          <div className="space-y-2">
            <Label>Plan du projet</Label>
            <div className="mt-2">
              <label className="block">
                <span className="sr-only">Choisir un plan</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="h-64 relative rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-primary transition-colors cursor-pointer">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Aperçu du plan"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <Upload className="h-12 w-12 mb-4" />
                      <span>Cliquez pour sélectionner un plan</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
          >
            Créer le projet
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
