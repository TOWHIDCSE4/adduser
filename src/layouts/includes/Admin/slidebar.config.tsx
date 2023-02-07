import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  ProfileOutlined,
  FolderOpenOutlined,
  TagOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  NotificationOutlined,
  ApartmentOutlined,
  BlockOutlined,
  QuestionOutlined,
  SettingOutlined,
  HistoryOutlined,
  CommentOutlined,
  FileTextOutlined,
  DashboardOutlined,
  GroupOutlined
} from "@ant-design/icons";
import auth from "@src/helpers/auth";
const user = auth().user;

const sidebar = [
  {
    routeName: "frontend.admin.documentTemplate.index",
    icon: <DashboardOutlined />,
    permissions: {
      dashboard: "R",
    },
  },
  {
    routeName: "frontend.admin.application.title",
    icon: <FileTextOutlined />,
    permissions: {
      application: "R",
    },
    type: "sub",
    children: [
      {
        routeName: "frontend.admin.application.index",
        icon: <TeamOutlined />,
        permissions: {
          users: "R",
        },
      },
      {
        routeName: "frontend.admin.documents.index",
        icon: <TeamOutlined />,
        permissions: {
          users: "R",
        },
      },
      {
        routeName: "frontend.admin.documents.draft",
        icon: <ApartmentOutlined />,
        permissions: {
          roles: "R",
        },
      }
    ]
  },
  {
    routeName: "frontend.admin.users.title",
    icon: <UserOutlined />,
    routeParams: {},
    permissions: {
      users: "R",
    },
    type: "sub",
    children: [
      {
        routeName: "frontend.admin.users.index",
        icon: <TeamOutlined />,
        permissions: {
          users: "R",
        },
      },
      {
        routeName: "frontend.admin.roles.index",
        icon: <ApartmentOutlined />,
        permissions: {
          roles: "R",
        },
      },
      {
        routeName: "frontend.admin.tenants.index",
        icon: <GroupOutlined />,
        permissions: {
          tenants: "R",
        },
      }
    ]
  },
];

export default sidebar;
