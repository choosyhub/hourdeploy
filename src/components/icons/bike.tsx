"use client";

import { motion, useAnimation, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface BikeProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const wheelVariants: Variants = {
  normal: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

const frameVariants: Variants = {
  normal: { y: 0 },
  animate: {
    y: [-1, 1, -1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
    },
  },
};

const Bike = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  className,
  ...props
}: BikeProps) => {
  const controls = useAnimation();

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("cursor-pointer", className)}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      {...props}
    >
      <motion.circle
        cx="18.5"
        cy="17.5"
        r="3.5"
        variants={wheelVariants}
        animate={controls}
        initial="normal"
      />
      <motion.circle
        cx="5.5"
        cy="17.5"
        r="3.5"
        variants={wheelVariants}
        animate={controls}
        initial="normal"
      />
      <motion.g variants={frameVariants} animate={controls} initial="normal">
        <circle cx="15" cy="5" r="1" />
        <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
      </motion.g>
    </motion.svg>
  );
};

export { Bike };
