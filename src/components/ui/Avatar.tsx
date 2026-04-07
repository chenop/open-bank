interface AvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-xl",
};

export const Avatar = ({ name, color, size = "md" }: AvatarProps) => (
  <div
    className={`rounded-full flex items-center justify-center font-bold text-white ${sizeMap[size]}`}
    style={{ backgroundColor: color }}
  >
    {name.charAt(0)}
  </div>
);
