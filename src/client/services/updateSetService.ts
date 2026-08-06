export interface UpdateSetFile {
  sys_id: string;
  name: string;
  type: string;
  target_name: string;
  action: string;
  table_name: string;
  artifact_sys_id: string;
  file_name: string;
}

export interface UpdateSetFolder {
  folder: string;
  files: UpdateSetFile[];
}

export interface UpdateSetInfo {
  sys_id: string;
  name: string;
  app_scope?: string;
}

export interface UpdateSetData {
  updateSet: UpdateSetInfo;
  folders: UpdateSetFolder[];
}

export interface GroupedFiles {
  [type: string]: UpdateSetFile[];
}

export function groupFilesByType(data: UpdateSetData): GroupedFiles {
  const grouped: GroupedFiles = {};
  for (const folder of data.folders ?? []) {
    grouped[folder.folder] = folder.files;
  }
  return grouped;
}

export async function fetchUpdateSetFiles(): Promise<UpdateSetData> {
  const token = (window as any).g_ck || (window as any).NOW?.g_ck || "";

  const params = new URLSearchParams();
  params.set("sysparm_processor", "ajax_processor");
  params.set("sysparm_name", "GussAjax");
  params.set("sysparm_function", "getUpdateSetFiles");
  params.set("ni.nolog.x_referer", "ignore");

  const response = await fetch("/xmlhttp.do", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-UserToken": token,
    },
    body: params.toString(),
  });

  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  const answerEl = xmlDoc.querySelector("answer");

  if (answerEl && answerEl.textContent) {
    return JSON.parse(answerEl.textContent);
  }

  return { updateSet: { sys_id: "", name: "" }, folders: [] };
}
