import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useStateContext();
  const [search, setSearch] = useState("");
  const [sortAlphabetically, _setSortAlphabetically] = useState(false);

  useEffect(() => {
    getItems();
  }, []);

  const setSortAlphabetically = () => {
    setSearch("");
    _setSortAlphabetically(!sortAlphabetically);
  };

  const getItems = () => {
    setLoading(true);
    axiosClient
      .get("/items-dashboard")
      .then(({ data }) => {
        setItems(data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editProduct = (id) => {
    navigate(`/items/${id}`);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <input
          style={{ width: "30px" }}
          type="checkbox"
          value={sortAlphabetically}
          onChange={() => setSortAlphabetically()}
        />{" "}
        Sort Alphabetically
        <input
          type="text"
          placeholder="search"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </div>

      <div className="grid">
        {items
          .filter((o) => {
            if (!search.trim()) return true;
            return o?.title?.toLowerCase().includes(search.toLowerCase());
          })
          .sort((a, b) => {
            if (!sortAlphabetically) return 0;

            if (a?.title?.toLowerCase() < b?.title?.toLowerCase()) {
              return -1;
            }

            if (a?.title?.toLowerCase() > b?.title.toLowerCase()) {
              return 1;
            }

            return 0;
          })
          .map((i) => (
            <div key={i.id} className="grid-item">
              <div>
                {i.image_url && (
                  <img
                    src={import.meta.env.VITE_API_BASE_URL + "/" + i.image_url}
                    alt={
                      import.meta.env.VITE_API_BASE_URL + "/uploads/default.png"
                    }
                    className="img"
                  />
                )}
                {!i.image_url && (
                  <img
                    src={
                      import.meta.env.VITE_API_BASE_URL + "/uploads/default.png"
                    }
                    className="img"
                  />
                )}
              </div>
              <div>
                <b>{i.title}</b>
              </div>
              <div>Seller name: {i.seller}</div>
              <div>
                {i.yours && (
                  <button
                    className="btn-edit"
                    onClick={() => editProduct(i.id)}
                  >
                    Yours - Edit?
                  </button>
                )}
                {!i.yours && i.stock > 0 && (
                  <button className="btn-add" onClick={() => addToCart(i)}>
                    Add to Cart
                  </button>
                )}
                {!i.yours && i.stock <= 0 && (
                  <button className="btn-disabled" onClick={() => addToCart(i)}>
                    Out of stock
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
