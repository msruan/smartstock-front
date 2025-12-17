"use client";

import {
  AlertCircleIcon,
  Download,
  Loader,
  PackageSearch,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { getInventoriePdf } from "@/api/queries";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  type InventoryReading,
  type InventorySummary,
  RequestStatus,
} from "@/types";
import { cn } from "@/utils";
import CancelInventoryDialog from "../dialogs/cancel-inventory";
import FinishInventoryDialog from "../dialogs/finish-inventory";
import ReopenInventoryDialog from "../dialogs/reopen-inventory";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Typography } from "../ui/typography";
import { InventoryStatusBadge } from "./inventories-cards";

interface Props {
  className?: string;
  selectedInventory: InventorySummary | null;
  setSelectedInventory: (inventory: InventorySummary | null) => void;
  inventoryReadings: InventoryReading[] | null;
  hasInventories: boolean;
  fetchDetailReqStatus: RequestStatus;
  fetchedInventoryId: number;
  mostRecentInventoryId: number | null;
}

export function InventoryDetailCard(props: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const hasContent = !!props?.inventoryReadings?.length;

  if (isDesktop) {
    return (
      <Card className={cn("h-fit", props.className)}>
        <CardHeader>
          <CardTitle className={cn("text-center relative", Typography.h3)}>
            Detalhes do inventário
            {props.selectedInventory !== null && (
              <div className="absolute left-0 bottom-1">
                <InventoryStatusBadge status={props.selectedInventory.status} />
              </div>
            )}
            {props.selectedInventory !== null && (
              <div className="absolute right-0 bottom-1">
                <Button
                  onClick={async () => {
                    const blob = await getInventoriePdf(
                      props.selectedInventory!.id,
                    );

                    if (blob instanceof Error) {
                      toast.error("Erro ao buscar PDF!");
                    } else {
                      try {
                        const url = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;

                        link.download = `Inventário-${props.selectedInventory?.id}.pdf`;

                        document.body.appendChild(link);

                        link.click();

                        link.parentNode?.removeChild(link);

                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        toast.error("Erro ao gerar PDF!");
                      }
                    }
                  }}
                >
                  <Download />
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <InventoryDetailContent {...props} />
        </CardContent>
        {props.selectedInventory?.status === `iniciada` && (
          <CardFooter className="flex justify-end gap-2">
            <CancelInventoryDialog inventoryId={props.selectedInventory.id}>
              <Button variant={"destructive"}>Cancelar</Button>
            </CancelInventoryDialog>
            <FinishInventoryDialog inventoryId={props.selectedInventory.id}>
              <Button className="bg-green-600 hover:bg-green-700">
                Finalizar
              </Button>
            </FinishInventoryDialog>
          </CardFooter>
        )}
        {props.selectedInventory?.status !== `iniciada` &&
          props.mostRecentInventoryId !== null &&
          props.mostRecentInventoryId === props.selectedInventory?.id && (
            <CardFooter className="flex justify-end gap-2">
              <ReopenInventoryDialog inventoryId={props.selectedInventory.id}>
                <Button>Reabrir</Button>
              </ReopenInventoryDialog>
            </CardFooter>
          )}
      </Card>
    );
  }

  return (
    <Drawer
      open={props.selectedInventory !== null}
      onOpenChange={(open) => {
        if (!open) {
          props.setSelectedInventory(null);
        }
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className={cn("text-center relative", Typography.h3)}>
            Inventário nº {props.selectedInventory?.id}
          </DrawerTitle>
        </DrawerHeader>
        <div className={cn("p-4", !hasContent && "pb-60")}>
          <InventoryDetailContent {...props} />
        </div>
        {props.selectedInventory?.status === `iniciada` && (
          <DrawerFooter>
            <Button className="bg-green-600 hover:bg-green-700">
              Finalizar
            </Button>
            <Button variant={"destructive"}>Cancelar</Button>
          </DrawerFooter>
        )}
        {props.selectedInventory?.status !== `iniciada` &&
          props.mostRecentInventoryId !== null &&
          props.mostRecentInventoryId === props.selectedInventory?.id && (
            <DrawerFooter className="flex justify-end gap-2">
              <ReopenInventoryDialog inventoryId={props.selectedInventory.id}>
                <Button>Reabrir</Button>
              </ReopenInventoryDialog>
            </DrawerFooter>
          )}
      </DrawerContent>
    </Drawer>
  );
}

function InventoryDetailContent(props: Omit<Props, "className">) {
  return (
    <>
      {!props.hasInventories && (
        <Empty className="p-0 md:p-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearch />
            </EmptyMedia>
            <EmptyTitle>Sem inventários</EmptyTitle>
            <EmptyDescription>
              Nenhum inventário realizado com a pistola ainda.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {props.hasInventories && !props.selectedInventory && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Nenhum inventário selecionado.</AlertTitle>
          <AlertDescription>
            Selecione um inventário na lista ao lado para ver seus detalhes.
          </AlertDescription>
        </Alert>
      )}

      {props.hasInventories && props.selectedInventory && (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="md:hidden flex items-center gap-1">
              <span className="text-muted-foreground">
                Status do inventário:
              </span>
              {props.selectedInventory !== null && (
                <InventoryStatusBadge status={props.selectedInventory.status} />
              )}
            </p>
            <p className="hidden md:block">
              <span className="text-muted-foreground">
                Inventário selecionado:{" "}
              </span>
              Nº {props.selectedInventory?.id}
            </p>
            <p>
              <span className="text-muted-foreground">
                Funcionário responsável:{" "}
              </span>
              {props.selectedInventory.employeeUsername}
            </p>
          </div>

          {props.fetchDetailReqStatus === RequestStatus.PENDING && (
            <Alert>
              <Loader className="h-4 w-4 animate-spin" />
              <AlertTitle>Buscando dados no servidor</AlertTitle>
            </Alert>
          )}
          {props.fetchDetailReqStatus === RequestStatus.ERROR && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Erro ao buscar dados do servidor.</AlertTitle>
              <AlertDescription>
                Por favor, recarregue a página e tente novamente.
              </AlertDescription>
            </Alert>
          )}
          {props.selectedInventory.id === props.fetchedInventoryId &&
            props.inventoryReadings !== null && (
              <div className="space-y-2">
                {props.inventoryReadings.length === 0 && (
                  <Alert>
                    <Tag />
                    <AlertTitle>
                      Nenhum produto lido no inventário
                      <span
                        className={cn(
                          "max-sm:hidden",
                          props.selectedInventory.status !== "iniciada" &&
                            "hidden",
                        )}
                      >
                        {" "}
                        até o momento
                      </span>
                      .
                    </AlertTitle>
                  </Alert>
                )}

                {props.inventoryReadings.length > 0 &&
                  props.inventoryReadings.map((read) => (
                    <Alert key={read.id}>
                      <Tag />
                      <AlertTitle>
                        {read.quantity} produtos {read.productCode} lidos
                      </AlertTitle>
                    </Alert>
                  ))}
              </div>
            )}
        </div>
      )}
    </>
  );
}
