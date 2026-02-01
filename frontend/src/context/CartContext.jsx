import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [shippingAddress, setShippingAddress] = useState(() => {
        const storedAddress = localStorage.getItem('shippingAddress');
        return storedAddress ? JSON.parse(storedAddress) : {};
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    const addToCart = (product, qty, size, color) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x._id === product._id && x.size === size && x.color === color);

            if (existItem) {
                return prevItems.map((x) =>
                    x._id === existItem._id && x.size === size && x.color === color ? { ...x, qty: x.qty + qty } : x
                );
            } else {
                return [...prevItems, { ...product, qty, size, color }];
            }
        });
    };

    const removeFromCart = (id, size, color) => {
        setCartItems((prevItems) => prevItems.filter((x) => !(x._id === id && x.size === size && x.color === color)));
    };

    const updateQty = (id, size, color, qty) => {
        setCartItems((prevItems) =>
            prevItems.map((x) =>
                x._id === id && x.size === size && x.color === color ? { ...x, qty } : x
            )
        );
    }

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }

    const isInCart = (productId, size, color) => {
        return cartItems.some((item) => item._id === productId && item.size === size && item.color === color);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQty,
            shippingAddress,
            saveShippingAddress,
            clearCart,
            isInCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
