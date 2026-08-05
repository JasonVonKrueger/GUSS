import React, { useState, useEffect } from "react";
import { fetchUpdateSetFiles, UpdateSetData, UpdateSetFile } from "./services/updateSetService";
import TreeView from "./components/TreeView";
import ContentFrame from "./components/ContentFrame";
import "./app.css";

export default function App() {
  const [data, setData] = useState<UpdateSetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<UpdateSetFile | null>(null);

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

  return (
    <div className="guss-app">
      <div className="guss-sidebar">
        <TreeView
          data={data}
          loading={loading}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onRefresh={handleRefresh}
        />
      </div>
      <div className="guss-content">
        <ContentFrame selectedFile={selectedFile} />
      </div>
    </div>
  );
}
