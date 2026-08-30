/** Global default preset IDs. Seeded once from code constants; user working copies clone these and never mutate them. */

export const DEFAULT_PRESET_NAME = 'Default'

export const DISSONANCE_PARAMS_DEFAULT_PRESET_ID =
  '8a9ee410-8d33-4a3a-9d42-cdf4618d6f19'

export const BEATING_ANALYSIS_DEFAULT_PRESET_ID =
  'f2ba6e72-a1a0-4c60-a5ba-df5d10ed9de5'

export const SENSORY_DISSONANCE_DEFAULT_PRESET_ID =
  'b0c7268d-8642-4941-8dc1-73374ce9ae3e'

export function defaultPresetMeta() {
  const now = Date.now()

  return {
    name: DEFAULT_PRESET_NAME,
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  }
}
