import { makeAutoObservable } from "mobx";
import { getSocket } from "../lib";

export type Order = {
  id: number;
  amountTokens: number;
  amountDollars: number;
  status: "Processing" | "Completed";
  createdAt: string;
};

export class OrdersStore {
  orders: Order[] = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeSocket();
  }

  get orderedByCreatedAtDesc(): Order[] {
    return [...this.orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  private initializeSocket() {
    const socket = getSocket();
    socket.on("orderList", (orders: Order[]) => {
      this.orders = orders;
    });
    socket.on("newOrder", (order: Order) => {
      this.orders = [order, ...this.orders];
    });
    socket.on("orderUpdated", (order: Order) => {
      this.orders = this.orders.map((o) => (o.id === order.id ? order : o));
    });
  }
}

export const ordersStore = new OrdersStore();
