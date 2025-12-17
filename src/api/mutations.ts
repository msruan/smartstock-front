"use server";

import { DEFAULT_HEADERS } from "@/constants";
import { env } from "@/env/server";
import type { ApplicationException } from "@/exceptions";
import type {
  APIErrorDTO,
  CreateEmployeeDTO,
  Employee,
  InventorySummary,
  LoginRequestDTO,
  LoginResponseDTO,
} from "@/types";
import { apiClient } from "./api-client";
import { AuthCookies } from "./cookies";
import { ApiEndpoints } from "./endpoints";

const BACKEND_URL = env.INTERNAL_SSRFID_API_URL;

export async function loginAction(
  credentials: LoginRequestDTO,
): Promise<{ message: string; success: boolean }> {
  const formData = new URLSearchParams();

  for (const [key, value] of Object.entries(credentials)) {
    formData.append(key, value);
  }

  const res = await fetch(`${env.INTERNAL_SSRFID_API_URL}/auth/login`, {
    body: formData.toString(),
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    const error: APIErrorDTO = await res.json();
    return { message: error.detail, success: false };
  }

  const body: LoginResponseDTO = await res.json();

  await AuthCookies.setTokens(body);

  return { message: "Logado com sucesso! Redirecionando...", success: true };
}

export async function createEmployee(
  payload: CreateEmployeeDTO,
): Promise<Employee | ApplicationException> {
  const endpoint = "/usuarios";
  const res = await apiClient(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body: Employee = await res.json();

  return body;
}

export async function logoutAction() {
  await AuthCookies.deleteTokens();
}

interface RefreshReturn {
  success: boolean;
  token: string | null;
}

let refreshPromise: Promise<RefreshReturn> | null = null;

/**
 * Faz refresh dos tokens de forma thread-safe
 * Evita m�ltiplas chamadas simult�neas de refresh
 */
export async function refreshTokenAction(): Promise<RefreshReturn> {
  if (refreshPromise) return refreshPromise;

  async function doRefresh() {
    const { refresh: refreshToken } = await AuthCookies.getTokens();

    if (!refreshToken) {
      await AuthCookies.deleteTokens();
      return { success: false, token: null };
    }

    try {
      const endpoint = ApiEndpoints.auth.refresh();

      const res = await fetch(BACKEND_URL + endpoint.url, {
        method: endpoint.method,
        body: JSON.stringify({ refresh_token: refreshToken }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        await AuthCookies.deleteTokens();
        return { success: false, token: null };
      }

      const tokens: LoginResponseDTO = await res.json();
      await AuthCookies.setTokens(tokens);
      return { success: true, token: tokens.access_token };
    } catch (err) {
      console.info("Error refreshing access token! ", err);
      return { success: false, token: null };
    } finally {
      setTimeout(() => {
        refreshPromise = null;
      }, 500);
    }
  }

  refreshPromise = doRefresh();

  return refreshPromise;
}

export async function activateEmployee(
  employeeId: number,
): Promise<Employee | ApplicationException> {
  const endpoint = `/usuarios/${employeeId}/ativar`;
  const res = await apiClient(endpoint, {
    method: "PUT",
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body: Employee = await res.json();

  return body;
}

export async function deactivateEmployee(
  employeeId: number,
): Promise<Employee | ApplicationException> {
  const endpoint = `/usuarios/${employeeId}/inativar`;
  const res = await apiClient(endpoint, {
    method: "PUT",
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body: Employee = await res.json();

  return body;
}

export async function cancelInventory(
  inventoryId: number,
): Promise<InventorySummary | ApplicationException> {
  const endpoint = `/conferencia/${inventoryId}/cancelar`;
  const res = await apiClient(endpoint, {
    method: "PUT",
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body: InventorySummary = await res.json();

  return body;
}

export async function finishInventory(
  inventoryId: number,
): Promise<InventorySummary | ApplicationException> {
  const endpoint = `/conferencia/${inventoryId}/encerrar`;
  const res = await apiClient(endpoint, {
    method: "PUT",
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body: InventorySummary = await res.json();

  return body;
}

export async function reopenInventory(
  inventoryId: number,
): Promise<InventorySummary | ApplicationException> {
  const endpoint = `/conferencia/${inventoryId}/reabrir`;
  const res = await apiClient(endpoint, {
    method: "PUT",
  });

  if (!(res instanceof Response)) {
    return res;
  }

  const body: InventorySummary = await res.json();

  return body;
}
