import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import useCart from "../../zustand/cartSlice";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const total = getTotalPrice();
  const totalItems = getTotalItems();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">

        <div className="text-7xl mb-5">🛒</div>

        <h2 className="text-3xl font-bold text-gray-700 mb-3">
          Cart is Empty
        </h2>

        <p className="text-gray-500 mb-6">
          Add products to continue shopping
        </p>

        <Link
          to="/products"
          className="bg-black text-white px-6 py-3 rounded-2xl"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div>
          <h1 className="text-4xl font-bold">
            My Cart 🛒
          </h1>

          <p className="text-gray-500 mt-2">
            {totalItems} Items in cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="border border-red-500 text-red-500 px-5 py-2 rounded-xl hover:bg-red-500 hover:text-white duration-300"
        >
          Clear Cart
        </button>

      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* PRODUCTS */}
        <div className="lg:col-span-2 space-y-6">

          {cart.map((item) => (

            <div
              key={item.id}
              className="bg-white shadow rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-6"
            >

              {/* PRODUCT CLICKABLE */}
              <Link
                to={`/product/${item.id}`}
                className="flex items-center gap-5 flex-1 cursor-pointer"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-28 object-contain bg-gray-100 rounded-2xl p-2 hover:scale-105 transition"
                />

                <div>

                  <h2 className="text-xl font-bold mb-2 hover:text-blue-500">
                    {item.title}
                  </h2>

                  {/* SIZE DISPLAY */}
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500 mb-1">
                      Size: {item.selectedSize.size} cm ({item.selectedSize.serves})
                    </p>
                  )}

                  <p className="text-gray-500 mb-2">
                    Stock: {item.stock}
                  </p>

                  <p className="text-green-600 text-lg font-bold">
                    $
                    {(
                      item.price -
                      (item.price * item.discount) / 100
                    ).toFixed(2)}
                  </p>

                </div>

              </Link>

              {/* ACTIONS */}
              <div className="flex items-center gap-5">

                {/* QTY */}
                <div className="flex items-center border rounded-2xl overflow-hidden">

                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-4 py-2 bg-gray-100"
                  >
                    -
                  </button>

                  <span className="px-5">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-4 py-2 bg-gray-100"
                  >
                    +
                  </button>

                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-xl"
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* SUMMARY */}
        <div className="bg-white shadow rounded-3xl p-6 h-fit sticky top-20">

          <h2 className="text-2xl font-bold mb-8">
            Order Summary
          </h2>

          <div className="flex justify-between mb-5">
            <span className="text-gray-500">Total Items</span>
            <span className="font-bold">{totalItems}</span>
          </div>

          <div className="flex justify-between mb-5">
            <span className="text-gray-500">Shipping</span>
            <span className="font-bold">Free</span>
          </div>

          <div className="flex justify-between mb-8 text-2xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* BUTTONS */}
          <div className="space-y-4">

            <Link
              to="/checkout"
              className="block text-center bg-black text-white py-4 rounded-2xl"
            >
              Proceed To Checkout
            </Link>

            <Link
              to="/products"
              className="block text-center border py-4 rounded-2xl"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

