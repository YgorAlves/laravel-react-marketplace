import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    setLoading(true);
    axiosClient
      .get("/items")
      .then(({ data }) => {
        setItems(data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDelete = (u) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    axiosClient.delete(`/items/${u.id}`).then(() => {
      getItems();
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Items</h1>
        <Link to="/items/new" className="btn-add">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Expiry Date</th>
              <th>Create Date</th>
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
          {!loading && (
            <tbody>
              {items?.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.title}</td>
                  <td>{u.description.slice(0, 25)}</td>
                  <td>{u.price}</td>
                  <td>{u.stock}</td>
                  <td>{u.expiry_date}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link to={"/items/" + u.id} className="btn-edit">
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      onClick={(ev) => onDelete(u)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
