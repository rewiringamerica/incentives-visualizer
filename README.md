# Incentives Visualizer

This project is an incentives visualizer designed to estimate electrification incentives for users based on their location on a map.

## Getting Started

Follow the instructions below to set up, install, and launch the application.

### Prerequisites

- Node.js (latest LTS or v16+)
- Yarn (v1.22+)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rewiringamerica/incentives-visualizer.git
   cd incentives-visualizer
   ```

2. Set up the environment:

   - Create a `.env` file in the root directory and add your API keys:

   ```bash
   MAPTILER_API_KEY=your_maptiler_api_key
   API_URL=http://localhost:3000

   # Production railway instance
   API_URL=https://apirewiringamericaorg-production.up.railway.app/
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Start the development server:

   ```bash
   yarn start
   ```

5. The application will be available at `http://localhost:1234` by default.

## Development

### Available Scripts

- `yarn start` - Start the development server
- `yarn build` - Build the application for production
- `yarn generate-types` - Generate TypeScript types from the API spec
- `yarn test` - Run Vitest tests
- `yarn test:playwright` - Run Playwright end-to-end tests
- `yarn format` - Check formatting with Prettier
- `yarn lint` - Lint the code with ESLint

## Project Structure

- `src/` - Main source code directory
  - `components/` - React components (Map, States, Counties, etc.)
  - `data/` - Static data files and geojson resources
  - `lib/` - Utility functions and API helpers
  - `styles/` - Tailwind CSS styles
  - `types/` - TypeScript type definitions
  - `mocks/` - Mock data for development and testing
  - `assets/` - Static assets like images and icons
- `test/` - Test files
  - `e2e/` - Playwright end-to-end tests

## Technology Stack

- React 19
- TypeScript
- Tailwind CSS
- Parcel bundler
- MapLibre GL for map rendering
- Material UI components
- Vitest and Playwright for testing
