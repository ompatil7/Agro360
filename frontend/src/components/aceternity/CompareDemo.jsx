import React from "react";
import { Compare } from "../../components/ui/compare";


import flow1 from "../../assets/flow1.jpg";
import flow2 from "../../assets/flow2.jpg";
export function CompareDemo() {
  return (
    <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 px-4">
      <Compare
        firstImage={flow1}
        secondImage={flow2}
        firstImageClassName="object-fit"
        secondImageClassname="object-fit"
        className=" mx-auto h-[250px] w-[200px] md:h-[650px] md:w-[1080px] rounded-[22px] md:rounded-lg"
        slideMode="hover"
      />
    </div>
  );
}

// import React from "react";
// import { Compare } from "../ui/compare";

// export function CompareDemo() {
//   return (
//     <div className="w-3/4 h-[60vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
//       <div
//         style={{
//           transform: "rotateX(15deg) translateZ(80px)",
//         }}
//         className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 mx-auto w-full h-full "
//       >
//         <Compare
//           firstImage={flow1}
//           secondImage={flow2}
//           firstImageClassName="object-cover object-left-top w-full"
//           secondImageClassname="object-cover object-left-top w-full"
//           className="w-full h-full rounded-[22px] md:rounded-lg"
//           slideMode="hover"
//           // autoplay={true}
//         />
//       </div>
//     </div>
//   );
// }
