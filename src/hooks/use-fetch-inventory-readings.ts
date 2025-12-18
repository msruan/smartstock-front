import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getInventoryReadings } from "@/api/queries";
import {
  type InventoryReading,
  type InventorySummary,
  RequestStatus,
} from "@/types";

interface UseReadingsReturn {
  selectedInventory: InventorySummary | null;
  setSelectedInventory: (inventory: InventorySummary | null) => void;
  inventoryReadings: InventoryReading[] | null;
  fetchedInventoryId: number;
  requestStatus: RequestStatus;
}

export function useFetchInventoryReadings(
  inventories: InventorySummary[],
  renderPageParams: string | null,
): UseReadingsReturn {
  const [selectedInventory, setSelectedInventory] =
    useState<InventorySummary | null>(
      renderPageParams
        ? (inventories.find((i) => i.id.toString() === renderPageParams) ??
            null)
        : null,
    );

  const [currentFetchedId, setFetchedId] = useState(-1);

  const [inventoryReadings, setInventoryReadings] = useState<
    InventoryReading[] | null
  >(null);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE,
  );

  const fetchInfo = useRef<{ isFetching: boolean; inventoryId: number | null }>(
    { isFetching: false, inventoryId: null },
  );
  const searchParams = useSearchParams();

  const firstRender = useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> [selectedInventory] -> We just want to monitor onSelect event
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedInventory?.id) {
      params.set("selected_inventory", selectedInventory.id.toString());
    } else {
      params.delete("selected_inventory");
    }

    if (firstRender.current) {
      firstRender.current = false;
    } else {
      window.history.replaceState({}, "", `/?${params.toString()}`);
    }

    async function attemptFetch(targetId: number) {
      if (!selectedInventory) {
        return;
      }

      fetchInfo.current = {
        isFetching: true,
        inventoryId: targetId,
      };

      setRequestStatus(RequestStatus.PENDING);
      const data = await getInventoryReadings(targetId);

      if (fetchInfo.current.inventoryId !== targetId) {
        return;
      }

      if (data instanceof Error) {
        setInventoryReadings(null);
        setRequestStatus(RequestStatus.ERROR);
      } else {
        setFetchedId(targetId);
        setInventoryReadings(data);
        setRequestStatus(RequestStatus.IDLE);
      }

      fetchInfo.current = { isFetching: false, inventoryId: null };
    }

    function abortFetch() {
      fetchInfo.current = { inventoryId: null, isFetching: false };
    }

    console.debug("INVENTÁRIO SELECIONADO: ", selectedInventory?.id);

    if (selectedInventory === null) {
      console.debug(
        "NENHUM INVENTÁRIO SELECIONADO: { abort? NAO. initFetch? NAO }",
      );
      return;
    } else if (selectedInventory.id === currentFetchedId) {
      console.debug("DADOS JA SALVOS EM MEMORIA: { abort? SIM. initFech? NAO}");
      abortFetch();
      return;
    } else if (
      fetchInfo.current.isFetching &&
      fetchInfo.current.inventoryId === selectedInventory.id
    ) {
      console.debug(
        "BUSCANDO O INVENTARIO ATUAL: { abort? NAO. initFetch? NAO }",
      );
      return;
    } else {
      console.debug("BUSCANDO OUTRO INVENTARIO: abort? SIM. initFetch? SIM");
      abortFetch();
      attemptFetch(selectedInventory.id);
    }
  }, [selectedInventory]);

  return {
    selectedInventory,
    setSelectedInventory,
    fetchedInventoryId: currentFetchedId,
    inventoryReadings: inventoryReadings,
    requestStatus,
  };
}
