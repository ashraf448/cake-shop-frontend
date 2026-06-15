// import { useState, useEffect } from "react";
// import banner1 from "../../assets/images/1.jpeg"; // نفس صورتك

// export default function IntroOverlay({ onFinish }) {
//   const [visible, setVisible] = useState(true);
//   const [fadeOut, setFadeOut] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setFadeOut(true);
//       setTimeout(() => {
//         setVisible(false);
//         if (onFinish) onFinish();
//       }, 800);
//     }, 4000);
//     return () => clearTimeout(timer);
//   }, [onFinish]);

//   if (!visible) return null;

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${
//         fadeOut ? "opacity-0 scale-110" : "opacity-100 scale-100"
//       }`}
//       style={{
//         backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${banner1})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="text-center text-white px-4 animate-fade-up">
//         {/* أيقونة متحركة */}
//         <div className="text-8xl md:text-9xl mb-6 drop-shadow-2xl animate-bounce-slow">
//           🍰
//         </div>

//         {/* الاسم الرئيسي */}
//         <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
//           Amira
//           <span className="text-amber-300"> Cake Designer</span>
//         </h1>

//         {/* شعار أو وصف */}
//         <p className="text-lg md:text-2xl text-amber-100 mt-4 font-light max-w-md mx-auto">
//           Handcrafted elegance for every celebration
//         </p>

//         {/* خطوط متحركة */}
//         <div className="flex justify-center gap-3 mt-10">
//           <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
//           <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse animation-delay-200"></div>
//           <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse animation-delay-400"></div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-up {
//           0% {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-up {
//           animation: fade-up 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
//         }
//         @keyframes bounce-slow {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-8px);
//           }
//         }
//         .animate-bounce-slow {
//           animation: bounce-slow 2s infinite ease-in-out;
//         }
//         .animation-delay-200 {
//           animation-delay: 0.2s;
//         }
//         .animation-delay-400 {
//           animation-delay: 0.4s;
//         }
//       `}</style>
//     </div>
//   );
// }