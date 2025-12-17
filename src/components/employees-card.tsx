import { AlertCircleIcon, UserCircle } from "lucide-react";
import type { Employee } from "@/types";
import { type ClassNameProp, cn } from "@/utils";
import ActivateUserDialog from "./dialogs/activate-employee";
import DeactivateUserDialog from "./dialogs/deactivate-employee";
import { Alert, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Typography } from "./ui/typography";

export function EmployeesCard({
  emplooyees,
  className,
}: { emplooyees: Employee[] } & ClassNameProp) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className={cn("text-center", Typography.h3)}>
          Funcionários operadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emplooyees.length > 0 ? (
          <ul className="space-y-3">
            {emplooyees
              .filter((e) => e.role === "stockist")
              .map((e) => (
                <li
                  key={e.username}
                  className="flex items-center justify-between p-3 bg-gray-100 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <UserCircle />
                    <p className="flex flex-col">
                      <span className="text-sm font-semibold">Funcionário</span>
                      <span>{e.username}</span>
                    </p>
                  </div>
                  {e.is_active ? (
                    <DeactivateUserDialog employee={e}>
                      <Button variant="destructive">Desativar Acesso</Button>
                    </DeactivateUserDialog>
                  ) : (
                    <ActivateUserDialog employee={e}>
                      <Button className="bg-green-800 hover:bg-green-700">
                        Ativar Acesso
                      </Button>
                    </ActivateUserDialog>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>
              Nenhum funcionário cadastrado até o momento.
            </AlertTitle>
          </Alert>
        )}
      </CardContent>

      {/* <CardFooter>
        <EmployeeFormModal>
          <Button className="w-full">Adicionar funcionário</Button>
        </EmployeeFormModal>
      </CardFooter> */}
    </Card>
  );
}
