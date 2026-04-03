import { useNavigate } from "react-router";
import { useProfile } from "../hooks/useProfile";
import ProfileCard from "../components/profile/ProfileCard";
import AchievementsList from "../components/profile/AchievementsList";
import ButtonSpinner from "../components/auth/ButtonSpinner";
import { HiArrowLeft } from "react-icons/hi";

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProfile();

  const handleBack = () => {
    navigate("/start");
  };

  return (
    <main className="min-h-screen bg-[#5C2DD5] flex flex-col items-center py-10 px-4">
      {/* Back Button Container */}
      <div className="w-full max-w-[560px] md:max-w-[1100px] mb-8 flex items-start">
        <button
          onClick={handleBack}
          className="bg-white border-4 border-black rounded-[20px] p-4 flex items-center justify-center shadow-[0px_4px_0px_#000000] hover:scale-110 active:scale-95 transition-all text-black cursor-pointer group"
          title="Back to Start"
        >
          <HiArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="w-full max-w-[560px] md:max-w-[1100px] pb-20">
        {isLoading ? (
          <div className="md:bg-[#7945FF] bg-[#7945FF] rounded-[40px] border-4 border-black w-full py-20 flex flex-col items-center justify-center gap-4 shadow-[0px_8px_0px_#000000]">
            <ButtonSpinner />
            <p className="text-white text-xl font-bold uppercase tracking-widest text-center px-6">
              Fetching Player Profile...
            </p>
          </div>
        ) : error ? (
          <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black w-full md:py-10 py-6 mx-auto md:shadow-[0px_8px_0px_#000000] text-white">
            <p className="text-xl font-bold text-[#FD6687] text-center px-6 uppercase">
              Failed to load profile. Please try again later.
            </p>
          </div>
        ) : data?.data ? (
          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-12">
            <div className="w-full md:w-auto md:shrink-0 mx-auto md:mx-0">
              <ProfileCard data={data.data} />
            </div>
            <div className="w-full flex-grow">
              <AchievementsList />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Profile;
