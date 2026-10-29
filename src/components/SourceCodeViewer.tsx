import React, { useState } from 'react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';
import { downloadProjectZip } from '../utils/exportZip';
import { Copy, Check, Download, FileCode, Folder, MapPin, Info, Tag, FileText } from 'lucide-react';

export const SourceCodeViewer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('database.sql');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const activeFile: ProjectFile = PROJECT_FILES.find(f => f.path === selectedFilePath) || PROJECT_FILES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleZipDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadProjectZip();
    } catch (err) {
      console.error('ZIP generation failed', err);
      alert('Could not generate ZIP automatically. You can copy the files directly using the Copy buttons.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with ZIP Exporter */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400">Complete Source Codebase</span>
            <span className="text-xs text-slate-400">&bull; 100% PHP, MySQL, HTML, CSS &amp; JS</span>
          </div>
          <h2 className="text-xl font-bold text-white">Student Portal Project Package</h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Every file is provided with its complete executable code, exact file system destination, 
            and plain-language breakdown. Ready to unzip directly into your local XAMPP <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300">htdocs/student-portal</code> directory.
          </p>
        </div>

        <button
          onClick={handleZipDownload}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-slate-900 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Generating ZIP...' : 'Download student-portal.zip'}
        </button>
      </div>

      {/* Main File Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Tree Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Folder className="w-4 h-4 text-blue-600" />
              <span>student-portal/</span>
            </div>
            <span className="text-[11px] text-slate-400">{PROJECT_FILES.length} Files</span>
          </div>

          <div className="space-y-1">
            {PROJECT_FILES.map((file) => {
              const isSelected = file.path === selectedFilePath;
              const isSQL = file.path.endsWith('.sql');
              const isConfig = file.path.startsWith('config/');
              const isInclude = file.path.startsWith('includes/');
              const isAsset = file.path.startsWith('assets/');

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSQL ? (
                      <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : file.path.endsWith('.md') ? (
                      <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    )}
                    <span className="font-mono text-[11px] truncate">{file.name}</span>
                  </div>

                  {isSQL && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      SQL
                    </span>
                  )}
                  {isConfig && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      Config
                    </span>
                  )}
                  {file.name === 'admin.php' && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code & Documentation View */}
        <div className="lg:col-span-8 space-y-4">
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                  <span>{activeFile.name}</span>
                  <span className="text-xs font-mono font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {activeFile.language.toUpperCase()}
                  </span>
                </h3>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Destination Location */}
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Where to Save: </span>
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">
                  {activeFile.targetLocation}
                </code>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">File Purpose: </span>
                <span>{activeFile.purpose}</span>
              </div>
            </div>

            {/* Key RDBMS / Security Concepts */}
            <div className="flex items-start gap-2 text-xs text-slate-600 pt-1">
              <Tag className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="font-semibold text-slate-800">Key Concepts: </span>
                {activeFile.keyConcepts.map((concept, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Code Display Frame */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-950 shadow-sm">
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-slate-300">{activeFile.path}</span>
              <span className="text-[11px]">{activeFile.content.split('\n').length} lines</span>
            </div>

            <div className="max-h-[560px] overflow-auto p-4 text-xs font-mono leading-relaxed text-slate-200">
              <pre>
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
