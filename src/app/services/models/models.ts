export interface Order {
    orderId: number;
    customerName: string;
    shippingAddress: string;
    orderDate: string;
    totalAmount: number;
    items: [];
    status: 0;
  }