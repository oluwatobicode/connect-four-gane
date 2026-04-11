import axios from "axios";
import { createContext, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { apiInstance, STORAGE_KEYS } from "../api/api";
import type { LoginData, LogInResult } from "../interface/LogIn";
import type {
  LoginWithGoogleData,
  LoginWithGoogleResult,
} from "../interface/GoogleLogin";
import type { SignUpData, SignUpResult } from "../interface/SignUp";
import type { AuthUser } from "../interface/User";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  pendingVerificationEmail: string;
  setPendingVerificationEmail: (email: string) => void;
  signup: (data: SignUpData) => Promise<SignUpResult>;
  login: (data: LoginData) => Promise<LogInResult>;
  loginWithGoogle: (
    data: LoginWithGoogleData,
  ) => Promise<LoginWithGoogleResult>;
  logout: () => Promise<void>;
};

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Error helper
// ---------------------------------------------------------------------------

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      fallback
    );
  }
  return error instanceof Error ? error.message : fallback;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initializers — run once on mount, no useEffect needed
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [pendingVerificationEmail, setPendingVerificationEmailState] =
    useState(() => localStorage.getItem(STORAGE_KEYS.pendingEmail) ?? "");

  // -------------------------------------------------------------------------
  // Session helpers
  // -------------------------------------------------------------------------

  const setSession = (data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => {
    setUser(data.user);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
    localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
    setPendingVerificationEmailState("");
    localStorage.removeItem(STORAGE_KEYS.pendingEmail);
  };

  const clearSession = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
  };

  const setPendingVerificationEmail = (email: string) => {
    setPendingVerificationEmailState(email);
    if (email) {
      localStorage.setItem(STORAGE_KEYS.pendingEmail, email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.pendingEmail);
    }
  };

  // -------------------------------------------------------------------------
  // Auth actions
  // -------------------------------------------------------------------------

  const signup = async (data: SignUpData): Promise<SignUpResult> => {
    try {
      const { data: res } = await apiInstance.post<SignUpResult>(
        "/auth/signup",
        data,
      );
      setPendingVerificationEmail(data.email);
      toast.success(
        res.message || "Check your email for your verification code",
      );
      return res;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create account"));
      throw error;
    }
  };

  const login = async (data: LoginData): Promise<LogInResult> => {
    try {
      const { data: res } = await apiInstance.post<LogInResult>(
        "/auth/login",
        data,
      );
      setSession({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      toast.success(res.message || "Login successful");
      return res;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to login"));
      throw error;
    }
  };

  const loginWithGoogle = async (
    data: LoginWithGoogleData,
  ): Promise<LoginWithGoogleResult> => {
    try {
      const { data: res } = await apiInstance.post<LoginWithGoogleResult>(
        "/auth/google",
        data,
      );
      setSession({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      toast.success(res.message || "Login successful");
      return res;
    } catch (error) {
      toast.error(getErrorMessage(error, "Google login failed"));
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken =
      localStorage.getItem(STORAGE_KEYS.refreshToken) ?? "";
    try {
      if (refreshToken) {
        await apiInstance.post("/auth/logout", { refreshToken });
      }
      toast.success("Logged out successfully");
    } catch {
      toast.success("Logged out successfully");
    } finally {
      clearSession();
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(
          user && localStorage.getItem(STORAGE_KEYS.accessToken),
        ),
        pendingVerificationEmail,
        setPendingVerificationEmail,
        signup,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Re-export the hook from its own file so existing imports keep working.
export { useAuth } from "./useAuth";
