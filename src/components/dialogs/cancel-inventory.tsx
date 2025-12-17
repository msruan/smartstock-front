import type { ReactNode } from "react";
import { toast } from "sonner";
import { cancelInventory } from "@/api/mutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: ReactNode | undefined;
  inventoryId: number;
};

function CancelInventoryDialog({ children, inventoryId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Você tem certeza absoluta?
          </DialogTitle>
          <DialogDescription>
            Isso cancelará o inventário {inventoryId}.
          </DialogDescription>
          <DialogFooter>
            <div className="flex gap-2 max-sm:flex-col">
              <DialogClose asChild>
                <Button variant={"outline"} size="sm">
                  Cancelar
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    toast.promise(cancelInventory(inventoryId), {
                      loading: `Cancelando o inventário ${inventoryId}...`,
                      success: () => {
                        // router.refresh();
                        window.location.reload();
                        return `Inventário ${inventoryId} cancelado!`;
                      },
                      error: (_err) => {
                        return `Erro ao cancelar o inventário ${inventoryId}!`;
                      },
                    });
                  }}
                  size={"sm"}
                  variant={"destructive"}
                >
                  Cancelar
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CancelInventoryDialog;
