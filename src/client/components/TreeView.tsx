import React, { useState } from "react";
import { UpdateSetData, UpdateSetFile, groupFilesByType } from "../services/updateSetService";
import "./TreeView.css";

interface TreeViewProps {
  data: UpdateSetData | null;
  loading: boolean;
  selectedFile: UpdateSetFile | null;
  onFileSelect: (file: UpdateSetFile) => void;
  onRefresh: () => void;
}

export default function TreeView({ data, loading, selectedFile, onFileSelect, onRefresh }: TreeViewProps) {
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  function toggleType(type: string) {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  const grouped = data ? groupFilesByType(data.files) : {};
  const sortedTypes = Object.keys(grouped).sort();

  return (
    <div className="tree-view">
      <div className="tree-header">
        <div className="tree-header-top">
          <span className="tree-title">UPDATE SET FILES</span>
          <button className="tree-refresh-btn" onClick={onRefresh} title="Refresh">
            ↻
          </button>
        </div>
        {data?.updateSet?.name && (
          <div className="tree-update-set-name">{data.updateSet.name}</div>
        )}
      </div>

      <div className="tree-body">
        {loading && <div className="tree-loading">Loading...</div>}
        {!loading && sortedTypes.length === 0 && (
          <div className="tree-empty">No files in current update set</div>
        )}
        {!loading &&
          sortedTypes.map((type) => {
            const files = grouped[type];
            const isExpanded = expandedTypes[type] !== false;
            return (
              <div key={type} className="tree-group">
                <div className="tree-group-header" onClick={() => toggleType(type)}>
                  <span className="tree-expand-icon">{isExpanded ? "▼" : "▶"}</span>
                  <span className="tree-group-label">
                    {type} ({files.length})
                  </span>
                </div>
                {isExpanded && (
                  <div className="tree-group-items">
                    {files.map((file) => (
                      <div
                        key={file.sys_id}
                        className={`tree-item ${selectedFile?.sys_id === file.sys_id ? "tree-item--selected" : ""}`}
                        onClick={() => onFileSelect(file)}
                        title={file.name}
                      >
                        <span className="tree-item-name">{file.target_name || file.name}</span>
                        {file.action && file.action !== "INSERT_OR_UPDATE" && (
                          <span className="tree-item-action">{file.action}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
