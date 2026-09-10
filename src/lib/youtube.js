const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export function getYoutubeApiKey() {
  return import.meta.env.VITE_YOUTUBE_API_KEY || '';
}

export async function fetchYoutubeLiveStreams(query, maxResults = 10) {
  const apiKey = getYoutubeApiKey();

  if (!apiKey) {
    throw new Error(
      'YouTube API key is missing. Add VITE_YOUTUBE_API_KEY to your environment variables.'
    );
  }

  const searchParams = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    eventType: 'live',
    q: query,
    maxResults: String(maxResults),
    key: apiKey,
  });

  const response = await fetch(
    `${YOUTUBE_BASE_URL}/search?${searchParams.toString()}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const message =
      errorData?.error?.message ||
      `YouTube request failed with status ${response.status}`;

    throw new Error(message);
  }

  const data = await response.json();

  return (data.items || [])
    .filter((item) => item.id?.videoId)
    .map((item) => ({
      id: item.id.videoId,
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url ||
        '',
      publishedAt: item.snippet.publishedAt,
      platform: 'youtube',
    }));
}

export async function fetchYoutubeMatchStream(homeTeam, awayTeam, maxResults = 5) {
  const query = `"${homeTeam}" "${awayTeam}" live`;

  return fetchYoutubeLiveStreams(query, maxResults);
}