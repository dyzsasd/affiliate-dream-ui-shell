
import { 
  BarChart3, 
  Building2,
  LayoutDashboard,
  Link as LinkIcon,
  User,
  Mail,
  TrendingUp,
  PieChart
} from "lucide-react";
import { TFunction } from "i18next";

export interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

export const getNavItems = (organizationType: string | undefined, t: TFunction): NavItem[] => {
  const baseItems: NavItem[] = [
    {
      name: t("sidebar.dashboard"),
      path: "/dashboard",
      icon: LayoutDashboard
    },
  ];

  if (organizationType === 'advertiser') {
    return [
      ...baseItems,
      {
        name: t("sidebar.advertisers"),
        path: "/advertisers",
        icon: Building2
      },
      {
        name: t("sidebar.campaigns"),
        path: "/campaigns",
        icon: LayoutDashboard
      },
      {
        name: "Analytics",
        path: "/analytics/advertiser",
        icon: TrendingUp
      },
      {
        name: t("sidebar.reports"),
        path: "/reporting",
        icon: BarChart3
      },
      {
        name: t("sidebar.invitations"),
        path: "/invitations",
        icon: Mail
      },
      {
        name: t("sidebar.myProfile"),
        path: "/profile",
        icon: User
      }
    ];
  } else if (organizationType === 'affiliate') {
    return [
      ...baseItems,
      {
        name: "Create Affiliate",
        path: "/affiliate/create",
        icon: Building2
      },
      {
        name: t("sidebar.trackingLinks"),
        path: "/tracking-links",
        icon: LinkIcon
      },
      {
        name: t("sidebar.reports"),
        path: "/reporting",
        icon: BarChart3
      },
      {
        name: t("sidebar.conversions"),
        path: "/reporting/conversions",
        icon: PieChart
      },
      {
        name: t("sidebar.invitations"),
        path: "/invitations",
        icon: Mail
      },
      {
        name: t("sidebar.myProfile"),
        path: "/profile",
        icon: User
      }
    ];
  } else if (organizationType === 'platform_owner') {
    return [
      ...baseItems,
      {
        name: "Organizations",
        path: "/organizations",
        icon: Building2
      },
      {
        name: "Users",
        path: "/users",
        icon: User
      },
      {
        name: t("sidebar.invitations"),
        path: "/invitations",
        icon: Mail
      },
      {
        name: t("sidebar.reports"),
        path: "/reporting",
        icon: BarChart3
      },
      {
        name: t("sidebar.myProfile"),
        path: "/profile",
        icon: User
      }
    ];
  }

  // Default fallback
  return [
    ...baseItems,
    {
      name: t("sidebar.invitations"),
      path: "/invitations",
      icon: Mail
    },
    {
      name: t("sidebar.myProfile"),
      path: "/profile",
      icon: User
    }
  ];
};
