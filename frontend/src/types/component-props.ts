import type { ReactNode } from "react";
import type { NavigationRoute } from "@/types/navigation";

export type ChildrenProps = {
  children: ReactNode;
};

export type NavLinkProps = NavigationRoute & {
  isActive: boolean;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export type StateMessageProps = {
  title?: string;
  message?: string;
};

export type LoadingStateProps = {
  message?: string;
};
