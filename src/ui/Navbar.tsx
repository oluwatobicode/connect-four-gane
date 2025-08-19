import { useState } from "react";
import Modal from "../ui/Modal";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setShowModal(!showModal);
  };

  return (
    <nav className="text-white p-10 w-full">
      <div className="mx-auto max-w-4xl flex items-center">
        <div className="mr-auto">
          <button
            onClick={onClick}
            className="cursor-pointer w-[89px] h-[39px] bg-[#5C2DD5] rounded-[20px] text-[16px]"
          >
            Menu
          </button>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/images/logo.svg"
            className="w-[52px] h-[52px]"
            alt="multi-player logo"
          />
        </div>

        {showModal && <Modal />}

        <div className="ml-auto">
          <button className="cursor-pointer w-[89px] h-[39px] bg-[#5C2DD5] rounded-[20px] text-[16px]">
            Restart
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
