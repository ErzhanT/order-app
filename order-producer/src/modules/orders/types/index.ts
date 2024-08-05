export enum OrderStatus {
  success = 'success',
  pending = 'pending',
  cancelled = 'cancelled',
}

export interface OrderCreateMeta {
  productId: string;
  userId: string;
  status: OrderStatus.pending;
}

export interface OrderUpdateMeta {
  status: OrderStatus;
  count: number;
}

export interface OrderCancelMeta {
  reason: string;
}
