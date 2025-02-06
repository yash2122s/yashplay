const config = {
    // Use direct values for development
    apiKey: '5bfab939b1721316a653757539b52cc4',
    accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmZhYjkzOWIxNzIxMzE2YTY1Mzc1NzUzOWI1MmNjNCIsIm5iZiI6MTczNDM2NDk1NS42MjQsInN1YiI6IjY3NjA0ZjFiY2RmY2NjYmE2ZmM0ZWYyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tWPEyzzDykuZogjns4GUwJ9oBmteE8Fnm0-YtkmgqT8'
};

// Validate environment variables
if (!config.apiKey || !config.accessToken) {
    console.warn('Environment variables not found. Make sure they are set in Netlify dashboard.');
}

export default config; 