import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import ChatPage from "@/pages/chat";
import SingleChatPage from "@/pages/chat/chatId";

export const AUTH_ROUTES = {
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
};

export const PROTECTED_ROUTES = {
  CHAT: "/chat",
  SINGLE_CHAT: "/chat/:chatId",
};

export const authRoutesPaths = [
  {
    path: AUTH_ROUTES.SIGN_IN,
    element: <SignInPage />,
  },
  {
    path: AUTH_ROUTES.SIGN_UP,
    element: <SignUpPage />,
  },
];

export const protectedRoutesPaths = [
  {
    path: PROTECTED_ROUTES.CHAT,
    element: <ChatPage />,
  },
  {
    path: PROTECTED_ROUTES.SINGLE_CHAT,
    element: <SingleChatPage />,
  },
];

export const isAuthRoute = (path: string) => {
  return Object.values(AUTH_ROUTES).includes(path as keyof typeof AUTH_ROUTES);
};
