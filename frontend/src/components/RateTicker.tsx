import { observer } from "mobx-react-lite";
import { rateStore } from "../stores";

export const RateTicker = observer(function RateTicker() {
  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">Current rate</div>
        <div className="stat-value text-primary">
          ${rateStore.currentRate.toFixed(2)}
        </div>
        <div className="stat-desc">
          1 token = ${rateStore.currentRate.toFixed(2)}
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">Server status</div>
        <div
          className={`stat-value text-sm ${
            rateStore.isConnected ? "text-success" : "text-error"
          }`}
        >
          {rateStore.isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
    </div>
  );
});
