export enum RequestType {
  REDUCTION = 'REDUCTION',
  TRANSFER = 'TRANSFER',
}

export interface Request {
  userId: string;
  message: string;
  type: RequestType;
}

export interface UpdateRequest {
  status: string;
  numHours: number;
}

export interface TransferRequest extends Request {
  toUserId: string;
}
