import { Film } from "lucide-react";

const NarBar = () => {
  return (
    <header className="fixed top-0 px-4 lg:px-6 h-14 flex items-center w-screen m-2 justify-center">
      <a className="flex items-center justify-center" href="#">
        <Film className="h-6 w-6" />
        <span className="ml-2 text-2xl font-bold">iTunes</span>
      </a>
    </header>
  );
};

export default NarBar;
