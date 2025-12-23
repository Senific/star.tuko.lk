import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure the upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * POST /api/upload
 * 
 * Upload files (photos/videos) for contestant registration
 * Returns the public URLs of uploaded files
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string || 'photo'; // 'photo' or 'video'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedTypes = type === 'video' ? allowedVideoTypes : allowedImageTypes;

    // Create upload directory if it doesn't exist
    const uploadSubDir = type === 'video' ? 'videos' : 'photos';
    const targetDir = path.join(UPLOAD_DIR, uploadSubDir);
    
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB for images, 50MB for videos)
      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large. Max size: ${maxSize / (1024 * 1024)}MB` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const ext = path.extname(file.name) || (type === 'video' ? '.mp4' : '.jpg');
      const filename = `${uuidv4()}${ext}`;
      const filePath = path.join(targetDir, filename);

      // Write file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Generate public URL
      const publicUrl = `/uploads/${uploadSubDir}/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// Configure Next.js to handle large file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
