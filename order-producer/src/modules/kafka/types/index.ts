export enum EventType {
  CREATE = 'create',
  UPDATE = 'update',
  CANCEL = 'cancel',
}

export interface OrderEvent<TMetadata> {
  type: EventType;
  orderId: string;
  metadata: TMetadata;
}
