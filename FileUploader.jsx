import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, X, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUploader({ file, onFileSelect, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  }, [onFileSelect]);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onFileSelect(selectedFile);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return File;
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return FileText;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return Image;
    return File;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" />
        Upload Report
      </label>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="uploader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            htmlFor="file-upload"
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your medical report here
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, images, or text files • Max 10MB
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
              onChange={handleFileInput}
            />
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border"
          >
            {(() => {
              const Icon = getFileIcon(file.name);
              return (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              );
            })()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}