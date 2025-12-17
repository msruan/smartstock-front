import type { ReactNode } from "react";
import { toast } from "sonner";
import { finishInventory } from "@/api/mutations";
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

function FinishInventoryDialog({ children, inventoryId }: Props) {
  const dialogPromise = () => {
    return finishInventory(inventoryId);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Você tem certeza?</DialogTitle>
          <DialogDescription>
            Isso fechará o inventário {inventoryId}.
          </DialogDescription>
          <DialogFooter>
            <div className="flex gap-2 max-sm:flex-col">
              <DialogClose asChild>
                <Button variant={"outline"} size="sm" className="ml-2">
                  Cancelar
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    toast.promise(dialogPromise(), {
                      loading: `Finalizando o inventário ${inventoryId}...`,
                      success: (data) => {
                        // router.refresh();
                        if (!(data instanceof Error)) {
                          // // router.refresh();
                          window.location.reload();
                          return `Inventário ${inventoryId} finalizado!`;
                        } else throw new Error("");
                      },
                      error: (_err) => {
                        return `Erro ao finalizar o inventário ${inventoryId}!`;
                      },
                    });
                  }}
                  size={"sm"}
                >
                  Finalizar
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FinishInventoryDialog;
