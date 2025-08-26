import { observer } from "mobx-react-lite";
import { ordersStore } from "../stores";

export const OrdersList = observer(function OrdersList() {
  const items = ordersStore.orderedByCreatedAtDesc;

  if (!items.length) {
    return (
      <div className="alert">
        <span>No orders yet. Create your first order.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tokens</th>
            <th>Dollars</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.amountTokens}</td>
              <td>{o.amountDollars}</td>
              <td>
                <span
                  className={`badge ${
                    o.status === "Completed" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {o.status}
                </span>
              </td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
