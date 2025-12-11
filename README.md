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

# Configure environment variables
cp .env.example .env
# Edit .env with your API URLs

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

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=https://your-api-endpoint.ngrok-free.dev
VITE_ALLOWED_HOST=your-frontend.ngrok-free.dev
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | The backend API URL that serves conversation data |
| `VITE_ALLOWED_HOST` | (Optional) Allowed host for network access via ngrok |
