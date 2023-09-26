import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    setLoading(true);
    axiosClient
      .get("/order-items")
      .then(({ data }) => {
        setItems(data.data);
        console.log(items[0]?.review);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitReview = (item, summary) => {
    axiosClient
      .post("/review", { item_id: item.item_id, summary })
      .then(() => {
        setNotification(
          `Review submitted for product ${item.item_id} - ${item.title}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignorders: "center",
        }}
      >
        <h1>Leave a review for a product you bought</h1>
      </div>
      <div className="card animated fadeInDown review">
        {loading && <h1>Loading...</h1>}
        {!loading &&
          items.map((i) => (
            <div key={i.item_id} className="review-item">
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
              <div className="review-summary">
                <div>
                  {i.item_id} - {i.title}
                </div>
                <textarea
                  value={i?.review[0]?.summary}
                  onBlur={(ev) => submitReview(i, ev.target.value)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
