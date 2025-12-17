export interface APIErrorDTO {
  detail: string;
}

export enum RequestStatus {
  IDLE,
  PENDING,
  ERROR,
  SUCCESS,
}

/* --------------------------------- PRODUCT -------------------------------- */

export interface Product {
  id: number;
  name: string;
  productCode: string;
  description: string;
  location: string;
}

export interface GetProductDTO {
  id: number;
  nome: string;
  codigo_produto: string;
  descricao: string;
  localizacao: string;
}

export interface CreateProductDTO {
  nome: string;
  codigo_produto: string;
  descricao: string;
  localizacao: string;
}

export interface UpdateProductDTO extends CreateProductDTO {}

/* -------------------------------- INVENTORY ------------------------------- */

export type InventoryStatus = "iniciada" | "finalizada" | "cancelada";

export interface InventorySummary {
  id: number;
  status: InventoryStatus;
  employeeUsername: string;
}

export interface GetAllInventoryDTO {
  id: number;
  status: InventoryStatus;
  username_funcionario: string;
}

export interface InventoryReading {
  id: number;
  productCode: string;
  lastReadTimestamp: Date;
  quantity: number;
}

export interface ReadingDTO {
  id: number;
  codigo_produto: string;
  ultima_leitura: string;
  quantidade: number;
}

/* ---------------------------------- AUTH ---------------------------------- */

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  access_token: string;
  refresh_token: string;
  access_expire: string;
  refresh_expire: string;
}

export interface CreateUserResponseDTO {
  id: number;
  username: string;
  role: string;
}

export interface Employee {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
}

export interface CreateEmployeeDTO {
  username: string;
  role: string;
  password: string;
}
