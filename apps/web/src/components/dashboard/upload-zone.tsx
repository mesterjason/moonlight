'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Link2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboard';

export function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const addUpload = useDashboardStore((s) => s.addUpload);
  const addToQueue = useDashboardStore((s) => s.addToQueue);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  async function uploadFile(file: File) {
    const id = crypto.randomUUID();
    addUpload({ id, name: file.name, size: file.size, progress: 0, status: 'uploading', createdAt: new Date().toISOString() });
    addToQueue({ id, name: file.name, stage: 'Uploading...', progress: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      await res.json();
      useDashboardStore.getState().updateUpload(id, { progress: 100, status: 'completed' });
      useDashboardStore.getState().updateQueue(id, { stage: 'Queued', progress: 100 });
    } catch {
      useDashboardStore.getState().updateUpload(id, { status: 'failed' });
      useDashboardStore.getState().updateQueue(id, { stage: 'Failed', progress: 0 });
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) uploadFile(file);
    },
    [],
  );

  async function handleYoutubeSubmit() {
    if (!youtubeUrl.trim()) return;
    const id = crypto.randomUUID();
    addUpload({ id, name: `YouTube - ${youtubeUrl.slice(0, 30)}...`, size: 0, progress: 0, status: 'queued', createdAt: new Date().toISOString() });
    addToQueue({ id, name: 'YouTube Video', stage: 'Downloading...', progress: 0 });
    setYoutubeUrl('');
    setShowYoutubeInput(false);

    try {
      const res = await fetch('/api/upload/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      if (!res.ok) throw new Error('Import failed');
      await res.json();
      useDashboardStore.getState().updateQueue(id, { stage: 'Complete', progress: 100 });
      useDashboardStore.getState().updateUpload(id, { progress: 100, status: 'completed' });
    } catch {
      useDashboardStore.getState().updateQueue(id, { stage: 'Failed', progress: 0 });
      useDashboardStore.getState().updateUpload(id, { status: 'failed' });
    }
  }

  return (
    <div>
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center',
          dragging
            ? 'border-moonlight-400 bg-moonlight-500/5'
            : 'border-white/10 hover:border-white/20 bg-white/[0.02]',
        )}
      >
        <input
          type="file"
          accept="video/*"
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            for (const file of files) uploadFile(file);
          }}
        />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-moonlight-500/10 flex items-center justify-center mx-auto mb-6">
            <Upload className="h-7 w-7 text-moonlight-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {dragging ? 'Drop your video here' : 'Upload your video'}
          </h3>
          <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">
            Drag & drop or click to browse. Supports MP4, MOV, AVI up to 500MB.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="glow"
              onClick={() => document.getElementById('file-upload')?.click()}
              loading={false}
            >
              <File className="h-4 w-4" />
              Choose File
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            >
              <Video className="h-4 w-4" />
              YouTube Link
            </Button>
          </div>
        </div>
      </motion.div>

      {showYoutubeInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex gap-2"
        >
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube URL..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:border-moonlight-400/50 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleYoutubeSubmit()}
            />
          </div>
          <Button variant="primary" onClick={handleYoutubeSubmit}>
            <Link2 className="h-4 w-4" />
            Import
          </Button>
        </motion.div>
      )}
    </div>
  );
}
