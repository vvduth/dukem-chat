import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginType, RegisterType, UserType } from "@/types/auth.type";
import { API } from "@/lib/axios-client";
import { toast } from "sonner";
import { useSocket } from "./use-socket";
import { use } from "react";
interface AuthState {
  user: UserType | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isAuthStatusLoading: boolean;
  register: (data: RegisterType) => void;
  login: (data: LoginType) => void;
  logout: () => void;
  isAuthStatus: () => void;
}

export const useAuth = create<AuthState>()(
  // persist to keep the auth state across page reloads
  persist(
    (set) => ({
      user: null,
      isLoggingIn: false,
      isSigningUp: false,
      isAuthStatusLoading: false,
      register: async (formdata: RegisterType) => {
        set({ isSigningUp: true });
        try {
          const { data } = await API.post("/auth/register", formdata);
          set({
            user: data.user,
          });
          // trigger socket connection
          useSocket.getState().connectSocket();
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Registration failed");
        } finally {
          set({ isSigningUp: false });
        }
      },
      login: async (data: LoginType) => {
        set({ isLoggingIn: true });
        try {
            const response = await API.post("/auth/login", data);
            set({
              user: response.data.user,
            });
            useSocket.getState().connectSocket();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ isLoggingIn: false });
        }
      },
      logout:async () => {
        try {
            await API.post("/auth/logout");
            set({ user: null });
            useSocket.getState().disconnectSocket();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
      },
      isAuthStatus: async () => {},
    }),
    {
      name: "chat:root",
    },
  ),
);
