import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

type Order = {
  id: number;
  amountTokens: number;
  amountDollars: number;
  status: "Processing" | "Completed";
  createdAt: string;
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = Number(process.env.PORT || 3005);

let tokenRate = 100; // Initial token rate
const orders: Order[] = [];

// Emit current token rate every 5 seconds
setInterval(() => {
  // Update token rate randomly
  tokenRate = Number((tokenRate * (0.95 + Math.random() * 0.1)).toFixed(2));
  io.emit("tokenRate", tokenRate);
}, 5000);

// Handle new client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send current token rate to the new client
  socket.emit("tokenRate", tokenRate);

  // Send current list of orders
  socket.emit("orderList", orders);
});

// Create a new order
app.post(
  "/orders",
  (
    req: Request<
      unknown,
      unknown,
      { amountTokens: number; amountDollars: number }
    >,
    res: Response<Order>,
  ) => {
    const { amountTokens, amountDollars } = req.body;

    const newOrder: Order = {
      id: orders.length + 1,
      amountTokens,
      amountDollars,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    // Emit event about the new order
    io.emit("newOrder", newOrder);

    // Set a timer to update the order status
    setTimeout(() => {
      newOrder.status = "Completed";
      io.emit("orderUpdated", newOrder);
    }, Math.random() * 10000 + 5000); // Update status in 5-15 seconds

    res.status(201).json(newOrder);
  },
);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
