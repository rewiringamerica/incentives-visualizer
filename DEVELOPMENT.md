# Incentives Visualizer: Development Overview

## Project Description

The Incentives Visualizer is a web application designed to help users explore and discover available electrification incentives based on geographic location. The application displays an interactive map of the United States that allows users to select states and counties to view applicable incentives for clean energy and electrification upgrades.

## Core Features

### Interactive Map

- Interactive MapLibre-based visualization of the United States
- Color-coded state representation:
  - Yellow: States with full coverage (launched states)
  - Teal: Beta states with partial coverage
  - Grey: Uncovered states
- State and county selection capabilities with visual highlighting
- Custom legend showing the meaning of different state colors
- Zoom functionality to focus on selected states or counties
- When zoomed in on the map, it becomes color-coded based on incentive count:
  - Yellow: 20+ incentives
  - Teal: 10-19 incentives
  - Grey: 1-9 incentives

### Search and Navigation

- Search bar for finding states and counties
- Auto-complete functionality to assist user search
- Navigation toolbar with language selection (English/Spanish support)
- Visual feedback when hovering over selectable map elements

### Incentives Display

- Sidebar panel that appears on state/county selection
- Detailed incentive cards displaying:
  - Incentive programs
  - Short descriptions of available incentives
  - Warning chips for special cases (e.g., "Low Income Eligible")
  - Links to more information
- Filter system for narrowing down incentive types
- Responsive design elements to handle different screen sizes

### User Interface

- Clean, accessible design with Rewiring America branding
- Tooltips for additional information on truncated text
- Collapsible sidebar for improved mobile experience
- Custom icons for enhanced visual communication

## Technical Implementation

### Frontend Architecture

- React 19 component-based architecture
- TypeScript for type safety and better developer experience
- Tailwind CSS for styling with custom color schemes
- Material UI components for enhanced UI elements
- MapLibre GL for rendering the interactive map
- Responsive design principles across all components

### Data Architecture

- GeoJSON-based geographic data for states and counties
- Mock API responses for development and testing
- Integration with Rewiring America's API schema
- TypeScript-generated API types from OpenAPI specifications

### Testing Framework

- Vitest for unit and integration testing
- Playwright for end-to-end testing (currently not working, see issue https://github.com/rewiringamerica/incentives-visualizer/issues/96)
- Custom test utilities and mocks

## Current Status and Implementation Notes

### State and County Visualization

- The application currently displays all U.S. states with appropriate color-coding based on incentives coverage
- States are categorized as:
  - **Launched States**: Full incentives coverage available
  - **Beta States**: Partial incentives coverage being tested
  - **Uncovered States**: No incentives data currently available
- County-level data is loaded but only shown when zoomed in
- State and county boundary data uses Albers projection for accurate geographic representation

### Incentives Display

- Incentive data is currently sourced from mock data
- Incentives are filterable by category types
- Each incentive displays relevant metadata including payment methods and eligibility requirements
- Cards include truncated text with tooltips for overflow content

### Search Functionality

- Search by state or county name is fully implemented
- Autocomplete suggestions help users find locations quickly
- Search results zoom the map to the selected location

### UI Considerations

- Custom card components handle different display formats
- Responsive design adapts to various screen sizes
- Accessibility considerations implemented in interactive elements

## Known Issues and Limitations

1. **Playwright Tests**: They currently do not work on the github workflow
2. **Mobile Responsiveness**: Some components need additional refinement for smaller screens
3. **Search Functionality**: Address search not yet implemented, limited to state and county names

## Development Environment

To work on this project, developers need:

- Node.js (latest LTS version)
- Yarn package manager
- MapTiler API key for map rendering
- Understanding of React, TypeScript, and geospatial data
