import JSZip from 'jszip';
import { HOSPITAL_FILES } from '../data/hospitalFiles';

export async function downloadHospitalZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('hospital-portal');

  if (!rootFolder) {
    throw new Error('Could not create hospital-portal folder in zip');
  }

  // Add all hospital project files into their respective subdirectories
  for (const file of HOSPITAL_FILES) {
    rootFolder.file(file.path, file.content);
  }

  // Generate zip file as blob
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'hospital-portal.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

// Alias for backwards compatibility
export const downloadProjectZip = downloadHospitalZip;

