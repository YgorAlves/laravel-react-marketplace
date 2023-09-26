import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  notification: null,
  cart: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  addToCart: () => {},
  setCart: () => {},
});

export const ContextProvider = ({ children }) => {
  const ACCESS_TOKEN = "ACCESS_TOKEN";

  const [user, setUser] = useState({});
  const [notification, _setNotification] = useState("");
  const [token, _setToken] = useState(localStorage.getItem(ACCESS_TOKEN));
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    let cartItemExists = cart.findIndex((i) => i.id === item.id);
    if (cartItemExists >= 0) {
      cart[cartItemExists].quantity++;
      setCart([...cart]);
    } else {
      let temp = cart;
      let quantity = 1;
      temp.push({ ...item, quantity });
      setCart([...temp]);
    }
  };

  const setNotification = (message) => {
    _setNotification(message);
    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  const setToken = (token) => {
    _setToken(token);

    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN);
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        notification,
        cart,
        setUser,
        setToken,
        setNotification,
        addToCart,
        setCart,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
