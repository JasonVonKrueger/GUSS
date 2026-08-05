import "@servicenow/sdk/global";
import { ApplicationMenu, Record } from "@servicenow/sdk/core";

const gussMenu = ApplicationMenu({
  $id: Now.ID["guss-menu"],
  title: "GUSS",
  hint: "Global Update Set Studio",
  description: "Developer tool for managing update set files",
  active: true,
});

export const gussModule = Record({
  $id: Now.ID["guss-module"],
  table: "sys_app_module",
  data: {
    title: "Update Set Studio",
    application: gussMenu,
    link_type: "DIRECT",
    query: "x_159204_guss_main.do",
    hint: "Open GUSS - Global Update Set Studio",
    active: true,
    order: 100,
  },
});
