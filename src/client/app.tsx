import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchUpdateSetFiles, UpdateSetData, UpdateSetFile } from "./services/updateSetService";
import TreeView from "./components/TreeView";
import ContentFrame from "./components/ContentFrame";
import "./app.css";

const BASE_SIDEBAR_WIDTH = 320;
const RESIZE_MIN = BASE_SIDEBAR_WIDTH - 75;
const RESIZE_MAX = BASE_SIDEBAR_WIDTH + 75;

export default function App() {
  const [data, setData] = useState<UpdateSetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<UpdateSetFile | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(BASE_SIDEBAR_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(BASE_SIDEBAR_WIDTH);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await fetchUpdateSetFiles();
      setData(result);
    } catch (err) {
      console.error("Failed to load update set files:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(file: UpdateSetFile) {
    setSelectedFile(file);
  }

  function handleRefresh() {
    setSelectedFile(null);
    loadData();
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [sidebarWidth]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const next = Math.min(RESIZE_MAX, Math.max(RESIZE_MIN, startWidth.current + delta));
      setSidebarWidth(next);
    }
    function onMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="guss-app">
      <div className="guss-sidebar" style={{ width: sidebarWidth }}>
        <TreeView
          data={data}
          loading={loading}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onRefresh={handleRefresh}
        />
      </div>
      <div className="guss-resize-handle" onMouseDown={onMouseDown} />
      <div className="guss-content">
        <ContentFrame selectedFile={selectedFile} />
      </div>
    </div>
  );
}
