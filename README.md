# Inbest Agent - Conversational AI Frontend

A real-time conversational AI frontend that displays phone conversation transcriptions from ElevenLabs API.


## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd inbest-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Configuration

The app connects to an API endpoint for conversation data. The API proxy is configured in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api/conversation': {
      target: 'https://your-api-endpoint.com',
      changeOrigin: true,
      rewrite: () => '/conversation',
    },
  },
},
```