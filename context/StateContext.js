import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

/**
 * StateContext responsible for providing global variables to all components in the application.
 */
export const StateContext = ({ children }) => {
    // Display / hide cart.
    const [showCart, setShowCart] = useState(false);

    // Contains an array of all the products in the cart.
    const [cartItems, setCartItems] = useState([]);

    // Contains a price of all the products in the cart.
    const [totalPrice, setTotalPrice] = useState(0);

    // Contains an ammount of all products in the cart.
    const [totalQuantities, setTotalQuantities] = useState(0);

    // Contains an ammount of added products to the cart.
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    /**
     * Method responsible for adding products to the cart.
     * 
     * @param {*} product - new product to add.
     * @param {*} quantity - amount of new products to add.
     */
    const onAdd = (product, quantity) => {
        // Check if the item is already in the cart
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        // Update price and quantity of all elements in the cart.
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProductInCart) {
            const updatedCardItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCardItems);
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product }]);
        }

        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    /**
     * Method responsible for removing products from the cart. 
     * 
     * @param {*} id - id of the product to be removed.
     */
    const onRemove = (id) => {
        foundProduct = cartItems.find((item) => item._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    /**
     * Method responsible for chaning the quantity of the products in the cart.
     * 
     * @param {*} id - id of the product to change quantity.
     * @param {*} value - flag, whether to add to or remove product from the cart.
     */
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id);

        if (value === 'inc') {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }
    }

    /**
     * Method manipulating the value of how many new products will be added to the cart.
     */
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    /**
     * Method manipulating the value of how many new products will be added to the cart.
     */
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);