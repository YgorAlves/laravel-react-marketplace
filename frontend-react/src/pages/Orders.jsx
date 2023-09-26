import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    setLoading(true);
    axiosClient
      .get("/order")
      .then(({ data }) => {
        setOrders(data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitReview = () => {};

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignorders: "center",
        }}
      >
        <h1>Orders</h1>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Total Price</th>
              <th>Create Date</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {orders?.map((o) => (
                <>
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      {o.items.reduce(
                        (acc, curr) => acc + curr.price * curr.quantity,
                        0
                      )}
                    </td>
                    <td>{o.created_at}</td>
                  </tr>
                  <table>
                    <thead>
                      <tr>
                        <th>Item Id</th>
                        <th>Title</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.map((i) => (
                        <tr key={i.id} style={{ backgroundColor: "#ccc" }}>
                          <td>{i.item_id}</td>
                          <td>{i.item.title}</td>
                          <td>{i.price}</td>
                          <td>{i.price * i.quantity}</td>
                          <td>{i.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
