import { useState } from "react";
import { ActivityTable } from "@/components/ActivityTable";
import { ActivityForm } from "@/components/ActivityForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function ActivitiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-activities-title">
            Atividades
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as atividades da equipe
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-activity-page">
              <Plus className="w-4 h-4 mr-2" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Atividade</DialogTitle>
            </DialogHeader>
            <ActivityForm 
              onSubmit={(data) => {
                console.log('Atividade criada:', data);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ActivityTable />
    </div>
  );
}