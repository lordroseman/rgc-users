export type MenuItem = {
    label: string;
    icon?: string;
    items?: MenuItem[];
    open?: boolean;
    to?: string;
    type?: string; // e.g. 'subtitle' for section headers
}