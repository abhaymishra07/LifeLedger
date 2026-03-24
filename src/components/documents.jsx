import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Link2, 
  Trash2, 
  FileText, 
  AlertTriangle,
  FolderOpen,
  LogOut,
  X,
  ExternalLink
} from "lucide-react";
// Assuming you have firebase auth for the logout button to match the other headers
import { auth } from "../firebase"; 

// ==================== HEADER COMPONENT ====================
function DocHeader({ total, files, links }) {
  return (
    <header className="bg-gradient-to-br from-foreground to-secondary-foreground dark:from-card dark:to-secondary rounded-b-[2.5rem] shadow-header px-5 pt-6 pb-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/60 text-sm font-medium">Your Vault</p>
            <h2 className="text-primary-foreground font-bold text-2xl">Documents</h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex-1">
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider font-medium mb-1">
              Total Documents
            </p>
            <h1 className="text-4xl font-black text-primary-foreground tracking-tight">
              {total}
            </h1>
          </div>

          <div className="flex gap-2">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 min-w-[80px] text-center">
              <div className="flex justify-center mb-1">
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-primary-foreground font-bold">{files}</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 min-w-[80px] text-center">
              <div className="flex justify-center mb-1">
                <Link2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-primary-foreground font-bold">{links}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

// ==================== DELETE CONFIRM MODAL ====================
function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onCancel}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-card w-full max-w-md rounded-t-3xl p-6 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-bold text-lg text-card-foreground">Delete Document?</h3>
                <p className="text-muted-foreground text-sm mt-1">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3.5 rounded-xl font-semibold border border-border text-card-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3.5 rounded-xl font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==================== MAIN COMPONENT ====================
const AddDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [link, setLink] = useState("");
  const [showUploadInput, setShowUploadInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  // Theme setup logic to keep pages consistent
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const addFileDocument = () => {
    if (!file || docName.trim() === "") return;
    const newDoc = {
      id: Date.now(),
      name: docName,
      type: "file",
      fileName: file.name,
      url: URL.createObjectURL(file),
    };
    setDocuments([newDoc, ...documents]); // Add new to top
    setFile(null);
    setDocName("");
    setShowUploadInput(false);
  };

  const addLinkDocument = () => {
    if (!link.trim() || docName.trim() === "") return;
    const newDoc = {
      id: Date.now(),
      name: docName,
      type: "link",
      url: link,
    };
    setDocuments([newDoc, ...documents]); // Add new to top
    setLink("");
    setDocName("");
    setShowLinkInput(false);
  };

  const confirmDelete = (id) => setDocToDelete(id);

  const deleteDocument = () => {
    const updatedDocs = documents.filter((doc) => doc.id !== docToDelete);
    setDocuments(updatedDocs);
    setDocToDelete(null);
  };

  // Stats
  const filesCount = documents.filter(d => d.type === "file").length;
  const linksCount = documents.filter(d => d.type === "link").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <DocHeader total={documents.length} files={filesCount} links={linksCount} />

      <main className="max-w-md mx-auto px-4 -mt-6">
        
        {/* Maintenance Banner */}
        {/* <div className="mb-6 p-4 rounded-2xl bg-warning/10 border border-warning/20 flex items-start gap-3 relative z-10 shadow-lg shadow-background">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-warning-foreground text-sm font-medium leading-relaxed">
            This feature is currently under maintenance. Please avoid using it for now.
          </p>
        </div> */}

        {/* Action Buttons */}
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowUploadInput(!showUploadInput);
              setShowLinkInput(false);
              setDocName("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border hover:bg-indigo-500 hover:border-indigo-500 hover:text-white dark:border-white ${
              showUploadInput 
                ? "bg-indigo-500 text-white border-indigo-500 shadow-md" 
                : "bg-card text-foreground border-border shadow-sm hover:bg-secondary"
            }`}
          >
            {showUploadInput ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            File
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowLinkInput(!showLinkInput);
              setShowUploadInput(false);
              setDocName("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border hover:bg-emerald-500 hover:border-emerald-500 hover:text-white dark:border-white ${
              showLinkInput 
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md" 
                : "bg-card text-foreground border-border shadow-sm hover:bg-secondary"
            }`}
          >
            {showLinkInput ? <X className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            Link
          </motion.button>
        </div>
        {/* Forms */}
        <AnimatePresence mode="wait">
          {showUploadInput && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-3xl shadow-card p-5 space-y-4 mb-6 border border-border overflow-hidden"
            >
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Document Title"
                className="w-full bg-secondary rounded-xl p-4 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              {/* Premium styled file input */}
              <input
                type="file"
                onChange={handleFileUpload}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-500/10 file:text-indigo-500
                  hover:file:bg-indigo-500/20 cursor-pointer bg-secondary rounded-xl"
              />
              <button
                onClick={addFileDocument}
                disabled={!file || !docName.trim()}
                className="w-full bg-indigo-500 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 transition-opacity"
              >
                Save File
              </button>
            </motion.div>
          )}

          {showLinkInput && (
            <motion.div
              key="link"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-3xl shadow-card p-5 space-y-4 mb-6 border border-border overflow-hidden"
            >
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Link Title"
                className="w-full bg-secondary rounded-xl p-4 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full bg-secondary rounded-xl p-4 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <button
                onClick={addLinkDocument}
                disabled={!link.trim() || !docName.trim()}
                className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 transition-opacity"
              >
                Save Link
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Recent Items</h3>
        </div>
        <p class="px-4 py-2 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg shadow-sm flex items-center gap-2">
            <span class="text-red-600 text-lg">⚠️</span>
            This feature is currently under maintenance. Please avoid using it for now, as your data may be cleared. Thank you for understanding!
          </p>

        {/* Document List */}
        <div className="space-y-3">
          <AnimatePresence>
            {documents.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <p className="text-muted-foreground">Your vault is empty.</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Upload a file or add a link to begin.</p>
              </motion.div>
            ) : (
              documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="group bg-card p-4 rounded-2xl shadow-card hover:shadow-card-hover border border-border transition-all duration-300 flex items-center gap-4"
                >
                  {/* Icon Block */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    doc.type === "file" ? "bg-indigo-500/10" : "bg-emerald-500/10"
                  }`}>
                    {doc.type === "file" ? (
                      <FileText className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Link2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>

                  {/* Info Block */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">
                      {doc.name}
                    </p>
                    {doc.type === "link" ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline flex items-center gap-1 mt-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {doc.url}
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {doc.fileName}
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => confirmDelete(doc.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <DeleteConfirmModal 
        isOpen={!!docToDelete} 
        onConfirm={deleteDocument} 
        onCancel={() => setDocToDelete(null)} 
      />
    </div>
  );
};

export default AddDocument;