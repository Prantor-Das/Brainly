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
  primary: "btn-primary",
  secondary: "btn-secondary",
};

const variantSize = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export const ButtonUI = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`btn-base ${variantStyle[props.variant]} ${variantSize[props.size]} font-medium`}
    >
      {props.startIcon && <span className="shrink-0">{props.startIcon}</span>}
      <span className="whitespace-nowrap">{props.text}</span>
      {props.endIcon && <span className="shrink-0">{props.endIcon}</span>}
    </button>
  );
};
