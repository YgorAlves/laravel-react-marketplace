import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const { cart, setCart, addToCart } = useStateContext();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const placeOrder = () => {
    setLoading(true);
    axiosClient
      .post(`/order`, { items: cart })
      .then(() => {
        setNotification("Item was successfully updated");
        setCart([]);
        navigate("/dashboard");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const _add = (i) => {
    addToCart(i);
    setCart([...cart]);
  };

  const removeOneFromCart = (item) => {
    let cartItemExists = cart.findIndex((i) => i.id === item.id);
    if (cartItemExists >= 0) {
      cart[cartItemExists].quantity--;
    }
    setCart([...cart]);
  };

  return (
    <>
      <div>
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Cart</h1>
          <button className="btn" onClick={() => placeOrder()}>
            Place Order
          </button>
          <button className="btn" onClick={() => setCart([])}>
            Clear cart
          </button>
          <h1>
            Total price:{" "}
            {cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)}
          </h1>
        </div>
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Actions</th>
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
            {!loading && cart && (
              <tbody>
                {cart &&
                  cart.map((i) => (
                    <tr key={i.id}>
                      <td>{i.id}</td>
                      <td>{i.title}</td>
                      <td>{i.quantity}</td>
                      <td>{i.price}</td>
                      <td>{i.price * i.quantity}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => _add(i)}
                          className="btn-add"
                        >
                          +1
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          onClick={() => removeOneFromCart(i)}
                          className="btn-delete"
                        >
                          -1
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
