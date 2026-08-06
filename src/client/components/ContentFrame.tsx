import React from "react";
import { UpdateSetFile, UpdateSetData } from "../services/updateSetService";
import "./ContentFrame.css";

interface ContentFrameProps {
  selectedFile: UpdateSetFile | null;
  updateSetData?: UpdateSetData | null;
}

function getRecordUrl(file: UpdateSetFile): string {
  const tableName = file.name.split("_").slice(0, -1).join("_");
  if (tableName) {
    return `/nav_to.do?uri=${tableName}.do?sys_id=${file.sys_id}`;
  }
  return `/nav_to.do?uri=sys_update_xml.do?sys_id=${file.sys_id}`;
}

export default function ContentFrame({ selectedFile, updateSetData }: ContentFrameProps) {
  if (!selectedFile) {
    const us = updateSetData?.updateSet;
    return (
      <div className="content-branding">
        <div className="content-branding-title">GUSS</div>
        <div className="content-branding-subtitle">Global Update Set Studio</div>
        <div className="content-debug-info">
          <strong>Current Update Set:</strong>{" "}
          {us?.name ? (
            <span>{us.name} <span style={{ opacity: 0.5, fontSize: "0.85em" }}>({us.sys_id || "no sys_id"})</span></span>
          ) : (
            <em>None detected</em>
          )}
        </div>
      </div>
    );
  }

  const url = getRecordUrl(selectedFile);

  return (
    <div className="content-iframe-wrapper">
      <div className="content-iframe-header">
        <span className="content-iframe-label">
          {selectedFile.target_name || selectedFile.name}
        </span>
        <span className="content-iframe-type">{selectedFile.type}</span>
      </div>
      <iframe className="content-iframe" src={url} title={selectedFile.name} />
    </div>
  );
}
