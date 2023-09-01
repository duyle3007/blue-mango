import { LazyMotion } from "framer-motion";
import { PropsWithChildren } from "react";

const loadFeatures = () => import("./features").then((res) => res.default);

export default function MotionLazyContainer({ children }: PropsWithChildren) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}
