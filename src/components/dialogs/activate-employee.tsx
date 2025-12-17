import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { activateEmployee } from "@/api/mutations";
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

type AlertDeleteUserProps = {
  children: ReactNode | undefined;
  employee: Employee;
};

function ActivateUserDialog({ children, employee }: AlertDeleteUserProps) {
  const router = useRouter();
  const activatePromise = () => {
    return activateEmployee(employee.id);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Você tem certeza?</DialogTitle>
          <DialogDescription>
            Isso permitirá novamente o acesso do usuário {employee.username}.
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
                    toast.promise(activatePromise(), {
                      loading: `Ativando o usuário ${employee.username}...`,
                      success: (data) => {
                        router.refresh();
                        if (!(data instanceof Error)) {
                          // router.refresh();
                          window.location.reload();
                          return `Usuário ${employee.username} ativado!`;
                        } else throw new Error("");
                      },
                      error: (_err) => {
                        return `Erro ao ativar o usuário ${employee.username}!`;
                      },
                    });
                  }}
                  size={"sm"}
                >
                  Ativar
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ActivateUserDialog;
