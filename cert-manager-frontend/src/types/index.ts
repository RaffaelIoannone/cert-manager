export interface ServerSession {
  user?: {
    name?: string | null;
    access_token?: string | null;
    roles?: string[] | null;
    email?: string | null;
    image?: string | null;
  };
}

export interface MenuItem {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  submenuItems?: MenuItem[];
}

export interface DownloadKeystoreFormState {
  data: string | null,
  filename: string,
}