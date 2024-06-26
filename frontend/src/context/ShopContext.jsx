import { createContext, useCallback, useEffect, useState } from "react";
// import all_product from "../assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [showPopup, setShowPopup] = useState(false);
  const [emailFound, setEmailFound] = useState(false);

  useEffect(() => {
    fetch("https://shopperwebsite-gn7e.onrender.com/allproducts")
      .then((res) => res.json())
      .then((data) => setAllProduct(data));
    if (localStorage.getItem("auth-token")) {
      fetch("https://shopperwebsite-gn7e.onrender.com/getcartdata", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  const handleSubscribeBtn = async (emailId) => {
    await fetch("http://localhost:4000/subscribe", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setEmailFound(true);
        }
      });
    setShowPopup(true);
  };

  const addToCart = (itemId) => {
    console.log(itemId);
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("https://shopperwebsite-gn7e.onrender.com/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      });
      // .then((res) => res.json())
      // .then((data) => console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));
    if (localStorage.getItem("auth-token")) {
      fetch("https://shopperwebsite-gn7e.onrender.com/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      });
      // .then((res) => res.json())
      // .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const handlePromocodeBtn = () => {
    
  }

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    setShowPopup,
    showPopup,
    handleSubscribeBtn,
    emailFound,
    setEmailFound,
    handlePromocodeBtn,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
