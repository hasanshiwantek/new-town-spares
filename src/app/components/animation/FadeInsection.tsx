// "use client";
// import { useRef, useEffect, useState } from "react";
// import clsx from "clsx";

// const animationClasses = {
//   "fade-up": "opacity-0 translate-y-5",
//   "fade-left": "opacity-0 -translate-x-5",
//   "fade-right": "opacity-0 translate-x-5",
//   "zoom-in": "opacity-0 scale-95",
//   "slide-up": "opacity-0 translate-y-10",
// };

// const activeClasses = {
//   "fade-up": "opacity-100 translate-y-0",
//   "fade-left": "opacity-100 translate-x-0",
//   "fade-right": "opacity-100 translate-x-0",
//   "zoom-in": "opacity-100 scale-100",
//   "slide-up": "opacity-100 translate-y-0",
// };

// export default function FadeInSection({
//   children
//   animation = "fade-up",
//   className = "",
//   delay = 0,
//   ...props // <- accepts onMouseEnter/onMouseLeave
// }:{children:any,animation:any,className:any,delay:any}) {
//   const ref = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setTimeout(() => setIsVisible(true), delay);
//           observer.unobserve(entry.target);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (ref.current) observer.observe(ref.current);

//     return () => observer.disconnect();
//   }, [delay]);

//   return (
//     <div
//       ref={ref}
//       {...props}
//       className={clsx(
//         "transition-all duration-700 ease-out will-change-transform",
//         animationClasses[animation],
//         isVisible && activeClasses[animation],
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// }
