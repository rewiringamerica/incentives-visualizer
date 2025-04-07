// Map from user-friendly categories to the exact API item keys
export const INCENTIVE_CATEGORIES: Record<string, string[]> = {
  'Clothes dryer': ['heat_pump_clothes_dryer', 'non_heat_pump_clothes_dryer'],
  'Cooking stove/range': ['electric_stove'],
  'Electric transportation': ['ebike', 'electric_vehicle_charger', 'new_electric_vehicle', 'new_plugin_hybrid_vehicle', 'used_electric_vehicle', 'used_plugin_hybrid_vehicle'],
  'Electrical panel & wiring': ['electric_panel', 'electric_wiring', 'electric_service_upgrades'],
  'Heating, ventilation & cooling': [
    'air_to_water_heat_pump',
    'central_air_conditioner',
    'ducted_heat_pump',
    'ductless_heat_pump',
    'electric_thermal_storage_and_slab',
    'evaporative_cooler',
    'geothermal_heating_installation',
    'smart_thermostat',
    'whole_house_fan',
    'integrated_heat_pump_controls',
    'other_heat_pump'
  ],
  'Water heater': ['heat_pump_water_heater', 'non_heat_pump_water_heater', 'solar_water_heater'],
  'Weatherization & efficiency': [
    'attic_or_roof_insulation',
    'basement_insulation',
    'cool_roof',
    'crawlspace_insulation',
    'floor_insulation',
    'wall_insulation',
    'other_insulation',
    'air_sealing',
    'door_replacement',
    'duct_replacement',
    'duct_sealing',
    'window_replacement',
    'solar_screen_films',
    'other_weatherization',
    'efficiency_rebates',
    'energy_audit'
  ],
  'Battery storage': ['battery_storage_installation'],
  'Lawn Care': ['electric_outdoor_equipment'],
  'Solar': ['rooftop_solar_installation']
};

// Create a reverse mapping to find which category an item belongs to
export const getIncentiveCategory = (item: string): string | null => {
  // Exact match is preferred
  for (const [category, items] of Object.entries(INCENTIVE_CATEGORIES)) {
    if (items.includes(item)) {
      return category;
    }
  }
  
  // If no exact match, return null
  return null;
};

// Get all category names
export const getAllCategoryNames = (): string[] => {
  return Object.keys(INCENTIVE_CATEGORIES);
};
