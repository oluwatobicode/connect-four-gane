import axios from "axios";
import {
  createContext,
  useRef,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { apiInstance } from "../api/api";
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
  isInitializing: boolean;
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

const KEYS = {
  user: "user",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  pendingEmail: "pendingVerificationEmail",
} as const;

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    localStorage.removeItem(KEYS.user);
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [pendingVerificationEmail, setPendingVerificationEmailState] =
    useState("");

  // Keep the access token in a ref so the axios interceptor always reads the
  // latest value without needing to be re-registered on every token change.
  const accessTokenRef = useRef<string | null>(null);

  // -------------------------------------------------------------------------
  // Initialise from localStorage
  // -------------------------------------------------------------------------

  useEffect(() => {
    accessTokenRef.current = localStorage.getItem(KEYS.accessToken);
    setUser(readStoredUser());
    setPendingVerificationEmailState(
      localStorage.getItem(KEYS.pendingEmail) ?? "",
    );
    setIsInitializing(false);
  }, []);

  // -------------------------------------------------------------------------
  // Axios request interceptor — attach token on every request
  // -------------------------------------------------------------------------

  useEffect(() => {
    const id = apiInstance.interceptors.request.use((config) => {
      const token = accessTokenRef.current;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    });

    return () => apiInstance.interceptors.request.eject(id);
  }, []); // registered once — ref always has latest token

  // -------------------------------------------------------------------------
  // Session helpers
  // -------------------------------------------------------------------------

  const setSession = (data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => {
    accessTokenRef.current = data.accessToken;
    setUser(data.user);
    localStorage.setItem(KEYS.user, JSON.stringify(data.user));
    localStorage.setItem(KEYS.accessToken, data.accessToken);
    localStorage.setItem(KEYS.refreshToken, data.refreshToken);
    setPendingVerificationEmailState("");
    localStorage.removeItem(KEYS.pendingEmail);
  };

  const clearSession = () => {
    accessTokenRef.current = null;
    setUser(null);
    localStorage.removeItem(KEYS.user);
    localStorage.removeItem(KEYS.accessToken);
    localStorage.removeItem(KEYS.refreshToken);
  };

  const setPendingVerificationEmail = (email: string) => {
    setPendingVerificationEmailState(email);
    if (email) {
      localStorage.setItem(KEYS.pendingEmail, email);
    } else {
      localStorage.removeItem(KEYS.pendingEmail);
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
    const refreshToken = localStorage.getItem(KEYS.refreshToken) ?? "";
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
        isAuthenticated: Boolean(user && accessTokenRef.current),
        isInitializing,
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
