import { ReactElement } from "react";
import { NavLink } from "react-router";

interface Props {
  children: ReactElement;
}

export default function ChildLayout({ children }: Props) {
  return (
    <div
      className={`z-10 h-screen fixed bottom-0 left-0 w-full  flex flex-col`}
    >
      <NavLink to="/items" className="flex-1" title="Close" preventScrollReset />
      <div className="min-h-[60vh] h-auto border-t-4 border-l-4 p-6 rounded-tl-xl overflow-auto shadow-top bg-fuchsia-50 border-fuchsia-600 bg-noise ">
        {children}
      </div>
    </div>
  );
}
