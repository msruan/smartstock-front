"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFetchInventoryReadings } from "@/hooks/use-fetch-inventory-readings";
import type { InventoryStatus, InventorySummary } from "@/types";
import { cn } from "@/utils";
import { Badge } from "../ui/badge";
import { InventoriesListCard } from "./inventories-list";
import { InventoryDetailCard } from "./inventory-detail-card";

interface Props {
  inventories: InventorySummary[];
  className?: string;
  selectedInventory: string | string[] | null;
}

export function InventoriesCards({
  inventories,
  selectedInventory: renderSelectedInventory,
}: Props) {
  const {
    selectedInventory,
    setSelectedInventory,
    inventoryReadings: inventoryDetails,
    requestStatus,
    fetchedInventoryId,
  } = useFetchInventoryReadings(
    inventories,
    renderSelectedInventory?.toString() ?? null,
  );

  return (
    <>
      <InventoriesListCard
        className="w-full md:w-1/2"
        inventories={inventories}
        selectedInventory={selectedInventory}
        setSelectedInventory={setSelectedInventory}
      />
      <InventoryDetailCard
        mostRecentInventoryId={
          inventories.length > 0 ? (inventories.at(0)?.id ?? null) : null
        }
        fetchedInventoryId={fetchedInventoryId}
        className="hidden md:flex md:w-1/2"
        hasInventories={inventories.length > 0}
        selectedInventory={selectedInventory}
        setSelectedInventory={setSelectedInventory}
        inventoryReadings={inventoryDetails}
        fetchDetailReqStatus={requestStatus}
      />
    </>
  );
}

export const InventoryStatusBadge = ({
  status,
}: {
  status: InventoryStatus;
}) => (
  <Badge
    className={cn("capitalize", {
      "bg-green-500": status === "finalizada",
      "bg-red-500": status === "cancelada",
      "bg-blue-400": status === "iniciada",
    })}
  >
    {status.substring(0, status.length - 1)}o
  </Badge>
);
