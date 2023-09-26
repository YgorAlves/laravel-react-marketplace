import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [file, setFile] = useState();
  const isActiveRef = useRef(true);

  const [item, setItem] = useState({
    id: null,
    title: "",
    description: "",
    price: 0,
    stock: 0,
    expiry_date: "",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/items/${id}`)
        .then(({ data }) => {
          setItem(data);
          if (data.is_active) {
            isActiveRef.current = data.is_active;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file, file.name);

    axiosClient
      .post(`/items/${item.id}/image`, formData, {
        headers: {
          "Content-Type": file.type,
        },
      })
      .then((res) => console.log(res))
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const { image_url, ...payload } = item;

    if (item.id) {
      axiosClient
        .put(`/items/${item.id}`, payload)
        .then(() => {
          setNotification("Item was successfully updated");
          navigate("/items");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/items", payload)
        .then(() => {
          setNotification("Item was successfully created");
          navigate("/items");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {item.id && <h1>Update Item: {item.name}</h1>}
      {!item.id && <h1>New Item</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={item.title}
              onChange={(ev) => setItem({ ...item, title: ev.target.value })}
              placeholder="Title"
            />
            <input
              value={item.description}
              onChange={(ev) =>
                setItem({ ...item, description: ev.target.value })
              }
              placeholder="Description"
            />
            <input
              value={item.price}
              onChange={(ev) => setItem({ ...item, price: ev.target.value })}
              placeholder="Price"
              type="number"
            />
            <input
              value={item.stock}
              onChange={(ev) => setItem({ ...item, stock: ev.target.value })}
              placeholder="Available stock"
              type="number"
              min="0"
              step="1"
            />
            <input
              value={item.expiry_date}
              onChange={(ev) =>
                setItem({ ...item, expiry_date: ev.target.value })
              }
              placeholder="Expiry Date"
              type="date"
            />
            <input onChange={handleFileChange} placeholder="File" type="file" />
            <div>
              <label>Mark if it should appear on public listing</label>
              <input
                style={{ width: "30%" }}
                checked={item.is_active}
                ref={isActiveRef}
                onChange={(ev) => {
                  setItem({ ...item, is_active: ev.target.checked });
                }}
                type="checkbox"
              />
            </div>

            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
