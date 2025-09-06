import { useNavigate } from "react-router";
import { useGameContext } from "../contexts/GameProvider";

const LevelList = () => {
  const navigate = useNavigate();
  const { state, setGameLevel } = useGameContext();

  const levelConfig = {
    easy: {
      label: "Easy",
      bgColor: "bg-[#FD6687]",
      textColor: "text-white",
      hoverBorder: "hover:border-[#5C2DD5]",
      hoverShadow: "hover:shadow-[0px_6px_0px_#5C2DD5]",
    },
    medium: {
      label: "Medium",
      bgColor: "bg-[#FFCE67]",
      textColor: "text-black",
      hoverBorder: "hover:border-black",
      hoverShadow: "hover:shadow-[0px_6px_0px_#000000]",
    },
    hard: {
      label: "Hard",
      bgColor: "bg-[#FFFFFF]",
      textColor: "text-black",
      hoverBorder: "hover:border-black",
      hoverShadow: "hover:shadow-[0px_6px_0px_#000000]",
    },
    professional: {
      label: "Professional",
      bgColor: "bg-[#FFFFFF]",
      textColor: "text-black",
      hoverBorder: "hover:border-black",
      hoverShadow: "hover:shadow-[0px_6px_0px_#000000]",
    },
  };

  const navigateGame = (selectedLevel: keyof typeof levelConfig) => {
    setGameLevel({ level: selectedLevel });
    navigate("/game");
    console.log(`Selected level: ${selectedLevel}`);
    console.log(`The state for playing with a cpu: ${state.currentPlayer}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderLevelButton = (levelKey: keyof typeof levelConfig) => {
    const config = levelConfig[levelKey];

    return (
      <button
        key={levelKey}
        onClick={() => navigateGame(levelKey)}
        className={`
          md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] 
          font-bold flex items-center justify-between cursor-pointer 
          ${config.bgColor} ${config.textColor} p-3 rounded-[20px] 
          border-4 border-black mb-4 transition-all duration-200 
          hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]
          ${config.hoverBorder} ${config.hoverShadow}
        `}
      >
        {config.label}
      </button>
    );
  };

  console.log(state.level);

  return (
    <div className="relative md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[480px] md:h-[537px] w-[335px] h-[407px] mx-auto md:shadow-[0px_8px_0px_#000000]">
      <div className="flex flex-col items-center justify-center p-3 md:p-8">
        <div className="mb-5">
          <h1 className="text-[56px] text-white font-bold leading-[71px]">
            CPU LEVELS
          </h1>
          <p className="text-white font-light leading-[7px]">
            Pick a cpu level that you can challenge.
          </p>
        </div>

        {Object.keys(levelConfig).map((levelKey) =>
          renderLevelButton(levelKey as keyof typeof levelConfig)
        )}
      </div>

      <div className="absolute md:-bottom-10 -bottom-25 left-1/2 transform -translate-x-1/2">
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

export default LevelList;
