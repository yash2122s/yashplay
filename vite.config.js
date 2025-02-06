import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    define: {
        'import.meta.env.VITE_API_KEY': JSON.stringify('5bfab939b1721316a653757539b52cc4'),
        'import.meta.env.VITE_ACCESS_TOKEN': JSON.stringify('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmZhYjkzOWIxNzIxMzE2YTY1Mzc1NzUzOWI1MmNjNCIsIm5iZiI6MTczNDM2NDk1NS42MjQsInN1YiI6IjY3NjA0ZjFiY2RmY2NjYmE2ZmM0ZWYyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tWPEyzzDykuZogjns4GUwJ9oBmteE8Fnm0-YtkmgqT8')
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        assetsDir: 'assets'
    },
    publicDir: 'public'
}); 