# Preparing GeoJSON Data for Projection

This guide explains how to prepare and load GeoJSON data for use with AlbersUSA projection. The steps include downloading GeoJSON files for states and counties, cleaning the files, and reprojecting them to the Albers USA projection.

---

## Prerequisites

### Install Required Tools
1. Install `mapshaper`:
   ```sh
   yarn global add mapshaper
   ```

2. Install `dirty-reprojectors`:
    ```sh
   yarn global add dirty-reprojectors
   ```

---

## Download GeoJSON Files

GeoJSON files for states and counties:

1. States File:
   [georef-united-states-of-america-state.geojson](https://public.opendatasoft.com/explore/dataset/georef-united-states-of-america-state/)

2. Counties File:
   [georef-united-states-of-america-county.geojson](https://public.opendatasoft.com/explore/dataset/georef-united-states-of-america-county/)

---

## Process the GeoJSON Files

### Step 1: Clean the GeoJSON Files
Run the following commands to clean the GeoJSON files using `mapshaper`:

1. For States:
   ```sh
   mapshaper georef-united-states-of-america-state.geojson -o format=geojson gj2008 cleaned-states.geojson
    ```

2. For Counties:
    ```sh
   mapshaper georef-united-states-of-america-county.geojson -o format=geojson gj2008 cleaned-counties.geojson
    ```

---

### Step 2: Reproject the GeoJSON Files
Reproject the cleaned GeoJSON files to the Albers USA projection using `dirty-reproject`:

1. For States:
   ```sh
   cat cleaned-states.geojson | dirty-reproject --forward albersUsa > states-albers.json
    ```

2. For Counties:
   ```sh
   cat cleaned-counties.geojson | dirty-reproject --forward albersUsa > counties-albers.json
    ```

---

## Final Output

After completing the steps above, the following files will be ready for use:
- states-albers.json: Reprojected GeoJSON file for states.
- counties-albers.json: Reprojected GeoJSON file for counties.

These files are now ready to be loaded for visualization with the Albers USA projection.

---

## Notes
- The GeoJSON files are maintained and updated annually. Ensure you download the latest versions from the provided links.
- If you would like to use the other projection, you can use the original georef files without reprojecting them.