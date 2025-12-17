"use server";

import type { ApplicationException } from "@/exceptions";
import type {
  Employee,
  GetAllInventoryDTO,
  GetProductDTO,
  InventoryReading,
  InventorySummary,
  Product,
  ReadingDTO,
} from "@/types";
import { apiClient } from "./api-client";

export async function getProducts(): Promise<Product[] | ApplicationException> {
  const endpoint = "/pecas/";
  const res = await apiClient(endpoint);

  if (!(res instanceof Response)) {
    return res;
  }

  const body: GetProductDTO[] = await res.json();

  const parse = (p: GetProductDTO): Product => {
    return {
      id: p.id,
      name: p.nome,
      description: p.descricao,
      location: p.localizacao,
      productCode: p.codigo_produto,
    };
  };

  return body.map(parse);
}

export async function getInventories(): Promise<
  InventorySummary[] | ApplicationException
> {
  const endpoint = "/conferencia";
  const res = await apiClient(endpoint);

  if (!(res instanceof Response)) {
    return res;
  }

  const body: GetAllInventoryDTO[] = await res.json();

  const parse = (i: GetAllInventoryDTO): InventorySummary => {
    return {
      id: i.id,
      status: i.status,
      employeeUsername: i.username_funcionario,
    };
  };

  return body.map(parse).toReversed();
}

export async function getInventoryReadings(
  id: number,
): Promise<InventoryReading[] | ApplicationException> {
  const endpoint = `/conferencia/${id}/leituras?limit=50&offset=0`;
  const res = await apiClient(endpoint);

  if (!(res instanceof Response)) {
    return res;
  }

  const body: { items: ReadingDTO[] } = await res.json();

  const parse = (read: ReadingDTO): InventoryReading => ({
    id: read.id,
    lastReadTimestamp: new Date(read.ultima_leitura),
    productCode: read.codigo_produto,
    quantity: read.quantidade,
  });

  console.log(body);

  return body.items.map(parse);
}

export async function getEmployees(): Promise<
  Employee[] | ApplicationException
> {
  const endpoint = "/usuarios";
  const res = await apiClient(endpoint);

  if (!(res instanceof Response)) {
    return res;
  }

  const body: Employee[] = await res.json();

  return body.toReversed();
}

export async function getInventoriePdf(inventoryId: number) {
  const endpoint = `/relatorios/pdf/?conferencia_id=${inventoryId}`;

  const res = await apiClient(endpoint, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body = await res.blob();

  return body;
}
