import "@servicenow/sdk/global";
import { UiPage } from "@servicenow/sdk/core";
import page from "../../client/index.html";

export const guss_page = UiPage({
  $id: Now.ID["guss-page"],
  endpoint: "x_159204_guss_main.do",
  html: page,
  direct: true,
  description: "GUSS - Global Update Set Studio main page",
});
