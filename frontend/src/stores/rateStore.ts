import { makeAutoObservable } from "mobx";
import { getSocket } from "../lib";

export class RateStore {
  currentRate: number = 100;
  isConnected: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeSocket();
  }

  private initializeSocket() {
    const socket = getSocket();
    socket.on("connect", () => {
      this.isConnected = true;
    });
    socket.on("disconnect", () => {
      this.isConnected = false;
    });
    socket.on("tokenRate", (rate: number) => {
      this.currentRate = Number(rate);
    });
  }
}

export const rateStore = new RateStore();
