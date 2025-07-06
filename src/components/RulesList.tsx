import { useNavigate } from "react-router";

const RulesList = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="relative bg-[#FFFFFF] rounded-[40px] md:w-[480px] md:h-[537px] w-[335px] h-[586px] border-3 border-black flex flex-col items-center justify-center shadow-[0px_10px_0px_#000000]">
      <div className="flex flex-col items-center justify-center p-3 md:p-8">
        <h1 className="text-[56px] font-bold leading-[71px]">RULES</h1>

        <div className="mt-[29px]">
          <h1 className="text-[20px] leading-[26px] font-bold text-[#7945FF]">
            OBJECTIVE
          </h1>
          <p className="text-[16px] font-medium mt-[16px] leading-[21px] text-[#565656]">
            Be the first player to connect 4 of the same colored discs in a row
            (either vertically, horizontally, or diagonally).
          </p>
        </div>

        <div className="mt-[29px]">
          <h1 className="text-[20px] mb-[16px] leading-[26px] font-bold text-[#7945FF]">
            How to play
          </h1>

          <ol className="font-medium space-y-2">
            <li className="flex items-start">
              <span className="text-black font-medium mr-2">1</span>
              <span className="text-[#565656]">
                Red goes first in the first game.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-black font-medium mr-2">2</span>
              <span className="text-[#565656]">
                Players must alternate turns, and only one disc can be dropped
                in each turn.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-black font-medium mr-2">3</span>
              <span className="text-[#565656]">
                The game ends when there is a 4-in-a-row or a stalemate.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-black font-medium mr-2">4</span>
              <span className="text-[#565656]">
                The starter of the previous game goes second on the next game.
              </span>
            </li>
          </ol>
        </div>
      </div>

      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleGoBack}
          className="w-[64px] h-[64px] cursor-pointer"
        >
          <img src="/images/icon-check.svg" alt="icon-check-image" />
        </button>
      </div>
    </div>
  );
};

export default RulesList;
