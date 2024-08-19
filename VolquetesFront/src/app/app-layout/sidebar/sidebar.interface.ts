export interface SideBarOption {
  name: string;
  picture: string;
  route: string;
  tooltipText: string;
  subOptions?: SideBarSubOption[];
}

export interface SideBarSubOption {
  name: string;
  route: string;
}
