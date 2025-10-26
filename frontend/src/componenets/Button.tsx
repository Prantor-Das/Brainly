// can create interface or type
// should not use it startIcon: any;
// startIcon?: React.ReactElement;
export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
}

const variantStyle = {
  primary: "bg-violet-600 text-white hover:bg-violet-700",
  secondary: "bg-violet-200 text-violet-500 hover:bg-violet-300",
};

const variantSize = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-8 py-4 text-lg",
};

const defaultStyle =
  "flex gap-2 m-2 rounded-lg items-center justify-center text-xl";

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`
  ${variantStyle[props.variant]} 
  ${variantSize[props.size]} 
  ${defaultStyle}`}
    >
      {props.startIcon ? props.startIcon : null}
      {props.text}
      {props.endIcon ? props.endIcon : null}
    </button>
  );
};
