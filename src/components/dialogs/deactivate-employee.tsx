import type { ReactNode } from "react";
import { toast } from "sonner";
import { deactivateEmployee } from "@/api/mutations";
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
import type { Employee } from "@/types";

type Props = {
  children: ReactNode | undefined;
  employee: Employee;
};

function DeactivateUserDialog({ children, employee }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Você tem certeza absoluta?
          </DialogTitle>
          <DialogDescription>
            Isso desativará o acesso do usuário {employee.username}.
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
                    toast.promise(deactivateEmployee(employee.id), {
                      loading: `Desativando o usuário ${employee.username}...`,
                      success: () => {
                        // router.refresh();
                        window.location.reload();
                        return `Usuário ${employee.username} desativado!`;
                      },
                      error: (_err) => {
                        return `Erro ao desativar o usuário ${employee.username}!`;
                      },
                    });
                  }}
                  size={"sm"}
                  variant={"destructive"}
                >
                  Desativar
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DeactivateUserDialog;
