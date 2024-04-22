import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-screen h-screen bg-screen bg-cover bg-no-repeat bg-center bg-fixed">
      <div className="w-full h-full bg-gradient-to-b from-transparent to-black">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
