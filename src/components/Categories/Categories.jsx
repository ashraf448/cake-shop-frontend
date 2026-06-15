import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();

  const cats = [
    { name: "weddings", icon: "💍" },
    { name: "birthdays", icon: "🎂" },
    { name: "Engagement", icon: "💎" },
    { name: "special", icon: "✨" },
  ];

  return (
    <section className="p-10">

      <p className="text-2xl font-bold mb-6">
        📦 Categories
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {cats.map((c) => (
          <div
            key={c.name}
            onClick={() =>
              navigate(`/products?category=${c.name}`)
            }
            className="bg-white p-6 rounded-xl text-center shadow hover:scale-105 transition cursor-pointer"
          >

            <div className="text-3xl mb-2">
              {c.icon}
            </div>

            <div className="font-semibold capitalize">
              {c.name}
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}