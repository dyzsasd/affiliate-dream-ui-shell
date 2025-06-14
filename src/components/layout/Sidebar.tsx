
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Target,
  Link,
  TrendingUp,
  DollarSign,
  User,
  Users,
  Building2,
  Mail,
  UserPlus,
  PieChart,
} from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  permission?: (userRole: string | undefined, organizationType: string | undefined) => boolean;
}

const getNavigationItems = (userRole: string | undefined, organizationType: string | undefined, t: TFunction): NavItem[] => {
  const baseItems: NavItem[] = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: BarChart3 },
    { href: "/campaigns", label: t("sidebar.campaigns"), icon: Target },
    { href: "/tracking-links", label: t("sidebar.trackingLinks"), icon: Link },
    { href: "/reporting", label: t("sidebar.reports"), icon: TrendingUp },
    { href: "/reporting/conversions", label: t("sidebar.conversions"), icon: DollarSign },
    { href: "/analytics/advertiser", label: "Advertiser Analytics", icon: PieChart },
  ];

  const adminItems: NavItem[] = [
    {
      href: "/advertisers",
      label: t("sidebar.advertisers"),
      icon: Building2,
      permission: (userRole: string | undefined) => userRole === "admin",
    },
    {
      href: "/organizations",
      label: t("sidebar.organizations"),
      icon: Users,
      permission: (userRole: string | undefined) => userRole === "admin",
    },
    {
      href: "/users",
      label: t("sidebar.myProfile"),
      icon: User,
      permission: (userRole: string | undefined) => userRole === "admin",
    },
    {
      href: "/invitations",
      label: t("sidebar.invitations"),
      icon: UserPlus,
      permission: (userRole: string | undefined) => userRole === "admin",
    },
  ];

  const affiliateItems: NavItem[] = [
    {
      href: "/affiliate/create",
      label: "Create Affiliate Account",
      icon: Mail,
      permission: (userRole: string | undefined, organizationType: string | undefined) =>
        userRole === "user" && organizationType === "affiliate",
    },
  ];

  let navigationItems = [...baseItems];

  if (userRole === "admin") {
    navigationItems = [...navigationItems, ...adminItems];
  } else if (userRole === "user" && organizationType === "affiliate") {
    navigationItems = [...navigationItems, ...affiliateItems];
  }

  return navigationItems.filter(item => !item.permission || item.permission(userRole, organizationType));
};

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { pathname } = useLocation();
    const { signOut, user, profile } = useAuth();
    const { t } = useTranslation();

    // Get user role and organization type from profile
    const userRole = profile?.role?.name || (user?.user_metadata as any)?.role;
    const organizationType = profile?.organization?.name || (user?.user_metadata as any)?.organization_type;

    const navigationItems = React.useMemo(() => {
      return getNavigationItems(userRole, organizationType, t);
    }, [userRole, organizationType, t]);

    // Get user display information from profile or user metadata
    const firstName = profile?.first_name || user?.user_metadata?.first_name || '';
    const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
    const organizationName = profile?.organization?.name || (user?.user_metadata as any)?.organization_name;

    return (
      <div
        className={cn(
          "flex h-full w-[280px] flex-col border-r bg-background py-4",
          className
        )}
        ref={ref}
        {...props}
      >
        <ScrollArea className="flex-1 space-y-4 px-3">
          <div className="flex items-center justify-between px-2">
            <Badge variant="secondary">
              {t("appName")}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                asChild
                key={item.href}
              >
                <RouterLink to={item.href}>
                  {React.createElement(item.icon, { className: "h-4 w-4" })}
                  <span>{item.label}</span>
                </RouterLink>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="flex flex-col space-y-1 p-3">
          <Separator />
          <div className="px-2 text-sm text-muted-foreground">
            {t("profile.organization")}
          </div>
          <div className="flex items-center space-x-2 px-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{firstName?.charAt(0)}{lastName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{firstName} {lastName}</p>
              <p className="text-xs text-muted-foreground">
                {organizationName || t("organization.noOrganization")}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={signOut}>
            {t("auth.signOut")}
          </Button>
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
