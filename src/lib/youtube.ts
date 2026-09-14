/**
 * YouTube Utility Functions
 * Supports parsing all standard YouTube URLs:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&t=10s
 * - https://youtu.be/VIDEO_ID
 * - https://youtu.be/VIDEO_ID?si=...
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 */

export interface ParsedYouTubeInfo {
  isValid: boolean;
  videoId: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
}

export function parseYouTubeVideo(inputUrl: string): ParsedYouTubeInfo {
  const trimmed = (inputUrl || "").trim();
  if (!trimmed) {
    return { isValid: false, videoId: null, embedUrl: "", thumbnailUrl: null };
  }

  // Regex to extract 11-character YouTube video ID
  const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(pattern);

  if (match && match[1]) {
    const videoId = match[1];
    return {
      isValid: true,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // If user entered direct MP4 or other embed URL already
  return {
    isValid: trimmed.includes("youtube.com/embed") || trimmed.includes("youtube-nocookie.com/embed"),
    videoId: null,
    embedUrl: trimmed,
    thumbnailUrl: null,
  };
}
