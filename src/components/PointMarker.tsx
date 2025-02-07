
import { Point } from "@/lib/db";

interface PointMarkerProps {
  point: Point;
  scale: number;
  position: { x: number; y: number };
  onClick: () => void;
}

export const PointMarker = ({ point, scale, position, onClick }: PointMarkerProps) => {
  return (
    <button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer z-10"
      style={{
        left: `${point.x * scale + position.x}px`,
        top: `${point.y * scale + position.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {point.number}
    </button>
  );
};
