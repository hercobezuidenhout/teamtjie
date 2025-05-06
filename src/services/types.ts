export interface PaginationOptions {
  skip?: number;
  take?: number;
}


export interface PaystackTransaction {
  reference: string;
  trans: number,
  status: string,
  message: string,
  transaction: string,
  trxref: string,
  redirecturl: string;
}
