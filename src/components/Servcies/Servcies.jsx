

import {
  FaTruck,
  FaBirthdayCake,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Services() {

  const navigate = useNavigate();

  const services = [
    {
      slug: "delivery",
      icon: <FaTruck size={35} />,
      title: "Fast Delivery",
      desc: "We deliver your cakes quickly and safely",
    },

    {
      slug: "cakes",
      icon: <FaBirthdayCake size={35} />,
      title: "Fresh Cakes",
      desc: "All cakes are made daily with fresh ingredients",
    },

    {
      slug: "payment",
      icon: <FaCreditCard size={35} />,
      title: "Secure Payment",
      desc: "Multiple safe payment methods available",
    },

    {
      slug: "support",
      icon: <FaHeadset size={35} />,
      title: "24/7 Support",
      desc: "We are always here to help you anytime",
    },
  ];

  return (
    <section className="py-16 bg-[#f8f5f0]">

      <p className="text-3xl font-bold text-center mb-12">
        Why choose us?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10">

        {services.map((srv, i) => (

          <div
            key={i}
            onClick={() => navigate(`/services/${srv.slug}`)}
            className="bg-white p-6 rounded-2xl text-center shadow-lg hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
          >

            <div className="flex justify-center mb-4 text-[#496D72]">
              {srv.icon}
            </div>

            <p className="text-xl font-bold mb-2">
              {srv.title}
            </p>

            <p className="text-gray-600 text-sm">
              {srv.desc}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}