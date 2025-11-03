import React, { useState } from "react";
import { Upload, Link2, Trash2, FileText } from "lucide-react";

const AddDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [link, setLink] = useState("");
  const [showUploadInput, setShowUploadInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

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
    setDocuments([...documents, newDoc]);
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
    setDocuments([...documents, newDoc]);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-700">
      {/* Main Container */}
      <div className="w-full max-w-4xl border border-gray-300 dark:border-gray-700 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-xl p-8 transition-all">

        {/* Header */}
        <header className="flex justify-between items-center w-full mb-8 border-b border-gray-300 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            📄 Add Document
          </h1>
          <div className="flex gap-3">
            {/* <button
              onClick={() => {
                setShowUploadInput(!showUploadInput);
                setShowLinkInput(false);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl shadow-md transition transform hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              Upload File
            </button> */}

            <button
              onClick={() => {
                setShowLinkInput(!showLinkInput);
                setShowUploadInput(false);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md transition transform hover:scale-105"
            >
              <Link2 className="w-5 h-5" />
              Add Link
            </button>
          </div>
        </header>

        {/* Upload Section */}
        {showUploadInput && (
          <div className="mb-6 space-y-4 animate-fadeIn">
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Enter document name..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={addFileDocument}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow transition transform hover:scale-105"
            >
              Add Document
            </button>
          </div>
        )}

        {/* Link Section */}
        {showLinkInput && (
          <div className="mb-6 space-y-4 animate-fadeIn">
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Enter document name..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste document link..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              onClick={addLinkDocument}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl shadow transition transform hover:scale-105"
            >
              Add Document
            </button>
          </div>
        )}

        {/* Document List */}
        <div className="w-full space-y-3">
          {documents.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No documents yet. Upload a file or paste a link to get started.
            </p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-5 py-4 rounded-2xl shadow-lg bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate max-w-xs">
                      {doc.name}
                    </h3>
                    {doc.type === "link" ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-xs block"
                      >
                        {doc.url}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {doc.fileName}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => confirmDelete(doc.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {docToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-80 text-center border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Delete Document?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteDocument}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDocToDelete(null)}
                className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDocument;
