// components
import SvgIconStyle from "../../../components/SvgIconStyle";

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  user: getIcon("ic_user"),
  ecommerce: getIcon("ic_ecommerce"),
  analytics: getIcon("ic_analytics"),
  dashboard: getIcon("ic_dashboard"),
  signOut: getIcon('ic_sign_out'),
  userGroup: getIcon("ic_user_group")
};

const navConfig = [
  {
    subheader: "Client",
    items: [
      {
        title: "Active overview",
        path: "/dashboard/activity-overview",
        icon: ICONS.dashboard,
      },
      {
        title: "Manage Accounts",
        path: "/dashboard/manage-accounts",
        icon: ICONS.userGroup,
      },
    ],
  },
  {
    subheader: "Your Account",
    items: [
      {
        title: "Sign Out",
        path: "",
        actionName: 'signOut',
        icon: ICONS.signOut,
      },
    ],
  },
];

export default navConfig;
