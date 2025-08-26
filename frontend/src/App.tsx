import { RateTicker } from "./components/RateTicker";
import { OrderForm } from "./components/OrderForm";
import { OrdersList } from "./components/OrdersList";

function App() {
  return (
    <div className="min-h-dvh bg-base-200">
      <div className="container mx-auto p-4 space-y-4">
        <RateTicker />
        <OrderForm />
        <OrdersList />
      </div>
    </div>
  );
}

export default App;
