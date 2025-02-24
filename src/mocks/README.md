# Overview

My idea for this is that the API responses themselves aren’t returning GeoJSON data with coordinates, but they do include key location fields (such as state, county, city, ZIP, etc) from which the incentives visualizer can derive the geographic boundaries.

## Parametrized by Location

When one calls endpoints like the calculator or utilities endpoints, one provides a location. The response then includes details such as the state, city, and county. This lets one know which geographic region the data applies to.

## Combining API Data with GeoJSON

Although the API responses contain incentive and program data (and even eligibility details), they don’t include the actual geographic shapes needed for mapping. For the map visualization, one would typically have separate GeoJSON files (or another geographic data source) that define state or county boundaries. One then overlays the incentive data onto these shapes based on the matching location parameters.

## Different Levels of Detail

The design supports different granularities. For example, one might:

- Display an unfiltered overlay showing incentive coverage across states.
- Zoom in to see county-level details.
- Even handle address-specific incentives when the user clicks on a specific point.
