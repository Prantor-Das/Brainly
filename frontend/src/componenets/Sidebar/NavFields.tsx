interface NavFieldProps{
  text: string,
  startIcon: React.ReactElement
}

const NavFields = (props: NavFieldProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors">
        {props.startIcon}
      </div>
      <span className="text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {props.text}
      </span>
    </div>
  );
};

export default NavFields;