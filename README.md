# Incentives Visualizer

This project is an incentives visualizer designed to estimate electrification incentives for users based on their location on a map.

## Getting Started

Follow the instructions below to set up, install, and launch the application.

### Prerequisites

- Node.js (v16 or higher)
- Yarn (v1.x or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rewiringamerica/incentives-visualizer.git
   cd incentives-visualizer
   ```

2. Set up the environment:

   - Create a `.env` file in the root directory and add your API keys and other environment variables as needed.

   ```bash
   MAPTILER_API_KEY=your_maptiler_api_key
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

## Existing Codebase

- `src/` - main source code directory
  - `components/` - React components, including Map.tsx, etc.
  - `lib/` - utility functions
  - `styles/` - Tailwind CSS styles
  - `types/` - types for API
  - `index.html`

Config files in the home directory include:

- `package.json`, `yarn.lock`, `.postcssrc.js`
