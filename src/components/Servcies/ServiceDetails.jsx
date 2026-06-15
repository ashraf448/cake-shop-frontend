import { useParams, useNavigate } from "react-router-dom";

export default function ServiceDetails() {

  const { type } = useParams();

  const navigate = useNavigate();

  const services = {
    "delivery": {
      title: "Fast Delivery",
      icon: "🚚",
      desc: "We deliver your cakes quickly and safely to your location with professional handling and refrigerated transport when needed.",
    },

    "cakes": {
      title: "Fresh Cakes",
      icon: "🎂",
      desc: "All cakes are prepared daily using premium fresh ingredients and custom designs for every occasion.",
    },

    "payment": {
      title: "Secure Payment",
      icon: "💳",
      desc: "We provide multiple secure payment methods including Instapay, Vodafone Cash, and cash on delivery.",
    },

    "support": {
      title: "24/7 Support",
      icon: "🎧",
      desc: "Our support team is available all day to help you with orders, delivery, and custom cake requests.",
    },
  };

  const service = services[type];

  if (!service) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">
          Service Not Found
        </h1>

        <button
          onClick={() => navigate("/")}
          className="bg-pink-500 text-white px-6 py-3 rounded-xl"
        >
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-16 px-4">

      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 bg-white shadow px-5 py-2 rounded-xl hover:bg-gray-100"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-8xl mb-6">
            {service.icon}
          </div>

          <h1 className="text-4xl font-bold mb-6">
            {service.title}
          </h1>

          <p className="text-gray-600 text-lg leading-8 max-w-2xl mx-auto">
            {service.desc}
          </p>

        </div>

      </div>

    </div>
  );
}