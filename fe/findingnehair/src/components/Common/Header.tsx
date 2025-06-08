import { useNavigate } from "react-router-dom";

interface HeaderProps {
    menu: string;
}


const Header = ({menu}: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center p-4">
      <button onClick={() => navigate(-1)} className="text-4xl mr-2 cursor-pointer focus:outline-none">‹</button>
      <h1 className="text-xl font-bold text-center w-full">{menu}</h1>
    </div>

  );
};

export default Header;
