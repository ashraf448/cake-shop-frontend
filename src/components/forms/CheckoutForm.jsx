import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const checkoutSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(11),
  address: z.string().min(5),
  city: z.string().min(2),
});

export default function CheckoutForm({ setFormData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data) => {
    setFormData(data); // نخزن البيانات مؤقت
    toast.success("Ready for payment");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

      <input {...register("name")} placeholder="Name" className="border p-3 rounded-xl" />
      <p className="text-red-500">{errors.name?.message}</p>

      <input {...register("email")} placeholder="Email" className="border p-3 rounded-xl" />
      <p className="text-red-500">{errors.email?.message}</p>

      <input {...register("phone")} placeholder="Phone" className="border p-3 rounded-xl" />
      <p className="text-red-500">{errors.phone?.message}</p>

      <input {...register("address")} placeholder="Address" className="border p-3 rounded-xl" />
      <p className="text-red-500">{errors.address?.message}</p>

      <input {...register("city")} placeholder="City" className="border p-3 rounded-xl" />
      <p className="text-red-500">{errors.city?.message}</p>

      <button className="bg-black text-white py-3 rounded-xl">
        Save Info
      </button>

    </form>
  );
}