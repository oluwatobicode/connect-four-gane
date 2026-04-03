import { useState, useEffect, useRef } from "react";
import {
  HiUserCircle,
  HiMail,
  HiTrendingUp,
  HiCalendar,
  HiPencilAlt,
  HiCheck,
  HiX,
  HiCloudUpload,
} from "react-icons/hi";
import { GoTrophy } from "react-icons/go";
import { useForm } from "react-hook-form";
import type { ProfileData } from "../../interface/Profile";
import { useUpdateProfile } from "../../hooks/useProfile";
import ButtonSpinner from "../auth/ButtonSpinner";
import { formatDate } from "../../utils/formatDate";

interface ProfileCardProps {
  data: ProfileData;
}

interface EditProfileInputs {
  username: string;
}

const ProfileCard = ({ data }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileInputs>({
    defaultValues: {
      username: data.username,
    },
  });

  // Keep form in sync if data changes (e.g. after successful mutation)
  useEffect(() => {
    reset({
      username: data.username,
    });
    setPreviewUrl(null);
    setSelectedFile(null);
  }, [data, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData: EditProfileInputs) => {
    const dataToSend = new FormData();
    dataToSend.append("username", formData.username);
    if (selectedFile) {
      dataToSend.append("avatar", selectedFile);
    }

    updateProfile(dataToSend, {
      onSuccess: () => {
        setIsEditing(false);
        setPreviewUrl(null);
        setSelectedFile(null);
      },
    });
  };

  return (
    <div className="md:bg-[#7945FF] bg-[#7945FF] rounded-[40px] border-4 border-black w-full max-w-[560px] p-6 sm:p-8 flex flex-col items-center gap-6 shadow-[0px_8px_0px_#000000] mx-auto text-white transition-all">
      {/* Header / Avatar */}
      <div className="relative group">
        <div
          onClick={() => isEditing && fileInputRef.current?.click()}
          className={`w-28 h-28 sm:w-36 sm:h-36 bg-[#FFCE67] rounded-full border-4 border-black flex items-center justify-center overflow-hidden shadow-[0px_4px_0px_#000000] transition-all
            ${isEditing ? "cursor-pointer hover:brightness-90 hover:border-white" : ""}`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : data.avatar ? (
            <img
              src={data.avatar}
              alt={data.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <HiUserCircle className="text-black w-20 h-20 sm:w-28 sm:h-28" />
          )}

          {isEditing && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <HiCloudUpload className="w-10 h-10 text-white" />
              <span className="text-[10px] font-black uppercase text-white">
                Upload
              </span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/*"
          className="hidden"
        />

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-1 -right-1 bg-white border-4 border-black rounded-full p-2 text-black hover:scale-110 active:scale-95 transition-all shadow-[0px_2px_0px_#000000] cursor-pointer"
            title="Edit Profile"
          >
            <HiPencilAlt className="w-5 h-5" />
          </button>
        )}

        <div className="absolute -bottom-2 -right-2 bg-[#FD6687] border-4 border-black rounded-full px-4 py-1 font-bold text-white shadow-[0px_2px_0px_#000000] text-sm sm:text-base rotate-3">
          LVL 1
        </div>
      </div>

      {/* Username / Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#FFCE67]">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              className="w-full bg-white border-4 border-black rounded-[20px] p-3 text-black font-black outline-none shadow-[0px_4px_0px_#000000] focus:border-[#FFCE67] transition-all uppercase"
              placeholder="Enter username"
            />
            {errors.username && (
              <span className="text-[#FD6687] text-xs font-black italic">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#FFCE67] border-4 border-black rounded-[20px] py-3 text-black font-black flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0px_4px_0px_#000000] disabled:opacity-50 cursor-pointer uppercase"
            >
              {isPending ? <ButtonSpinner /> : <HiCheck className="w-6 h-6" />}
              <span>{isPending ? "SAVING..." : "SAVE"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setPreviewUrl(null);
                setSelectedFile(null);
                reset();
              }}
              className="flex-1 bg-white border-4 border-black rounded-[20px] py-3 text-black font-black flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0px_4px_0px_#000000] cursor-pointer uppercase"
            >
              <HiX className="w-6 h-6" />
              <span>CANCEL</span>
            </button>
          </div>
        </form>
      ) : (
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-center break-all italic py-2">
          {data.username}
        </h2>
      )}

      {/* Info Sections */}
      {!isEditing && (
        <div className="w-full space-y-4 pt-2">
          <div className="bg-white border-4 border-black rounded-[20px] p-4 flex items-center gap-4 shadow-[0px_4px_0px_#000000] text-black">
            <HiMail className="w-8 h-8 text-[#5C2DD5] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-gray-400 uppercase leading-none">
                Email
              </span>
              <span className="font-bold break-all leading-tight">
                {data.email}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-[#FFCE67] border-4 border-black rounded-[20px] p-4 flex items-center gap-4 shadow-[0px_4px_0px_#000000] text-black group hover:-translate-y-1 transition-transform">
              <HiTrendingUp className="w-8 h-8 text-[#5C2DD5] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-500 uppercase leading-none">
                  ELO Rating
                </span>
                <span className="text-xl sm:text-2xl font-black">
                  {data.eloRating}
                </span>
              </div>
            </div>

            <div className="flex-1 bg-[#FD6687] border-4 border-black rounded-[20px] p-4 flex items-center gap-4 shadow-[0px_4px_0px_#000000] text-white group hover:-translate-y-1 transition-transform">
              <GoTrophy className="w-8 h-8 text-[#FFCE67] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#FFCE67] uppercase leading-none">
                  Total Games
                </span>
                <span className="text-xl sm:text-2xl font-black">
                  {data._count.gamesAsPlayer1 + data._count.gamesAsPlayer2}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black rounded-[20px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-[0px_4px_0px_#000000] text-black">
            <div className="flex items-center gap-4">
              <HiCalendar className="w-8 h-8 text-[#5C2DD5] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-500 uppercase leading-none">
                  Joined
                </span>
                <span className="font-bold">{formatDate(data.createdAt)}</span>
              </div>
            </div>
            <div className="bg-[#5C2DD5] text-white px-3 py-1 rounded-full font-black text-sm self-end sm:self-auto shadow-[0px_2px_0px_#000000] -rotate-1">
              PRO PLAYER
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
