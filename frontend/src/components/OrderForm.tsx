import { useState, type FormEvent } from "react";
import { rateStore } from "../stores";
import { observer } from "mobx-react-lite";
import { api } from "../lib";

type Mode = "tokens" | "dollars";

export const OrderForm = observer(function OrderForm() {
  const [mode, setMode] = useState<Mode>("tokens");
  const [tokens, setTokens] = useState<string>("");
  const [dollars, setDollars] = useState<string>("");

  const rate = rateStore.currentRate || 0;

  const handleModeChange = (next: Mode) => {
    setMode(next);
    if (next === "tokens" && dollars) {
      const t = parseFloat(dollars) / (rate || 1);
      setTokens(Number.isFinite(t) ? t.toString() : "");
    } else if (next === "dollars" && tokens) {
      const d = parseFloat(tokens) * rate;
      setDollars(Number.isFinite(d) ? d.toString() : "");
    }
  };

  const handleTokensChange = (v: string) => {
    setTokens(v);
    const num = parseFloat(v);
    const d = num * rate;
    setDollars(Number.isFinite(d) ? d.toFixed(2) : "");
  };

  const handleDollarsChange = (v: string) => {
    setDollars(v);
    const num = parseFloat(v);
    const t = num / (rate || 1);
    setTokens(Number.isFinite(t) ? t.toFixed(6) : "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amountTokens = parseFloat(tokens) || 0;
    const amountDollars = parseFloat(dollars) || 0;

    if (!amountTokens || !amountDollars) {
      return;
    }

    await api.post("/orders", { amountTokens, amountDollars });

    setTokens("");
    setDollars("");
    setMode("tokens");
  };

  return (
    <form className="card bg-base-100 shadow p-4" onSubmit={handleSubmit}>
      <div className="card-title mb-2">Create market order</div>

      <div className="join mb-4">
        <input
          type="radio"
          name="mode"
          aria-label="Tokens"
          className="join-item btn"
          checked={mode === "tokens"}
          onChange={() => handleModeChange("tokens")}
        />
        <input
          type="radio"
          name="mode"
          aria-label="Dollars"
          className="join-item btn"
          checked={mode === "dollars"}
          onChange={() => handleModeChange("dollars")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Amount in tokens</span>
          </div>
          <input
            type="number"
            step="0.000001"
            className="input input-bordered w-full"
            value={tokens}
            onChange={(e) => handleTokensChange(e.target.value)}
            disabled={mode !== "tokens"}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Amount in dollars</span>
          </div>
          <input
            type="number"
            step="0.01"
            className="input input-bordered w-full"
            value={dollars}
            onChange={(e) => handleDollarsChange(e.target.value)}
            disabled={mode !== "dollars"}
          />
        </label>
      </div>

      <div className="mt-4">
        <button className="btn btn-primary" type="submit">
          Create order
        </button>
      </div>
    </form>
  );
});
