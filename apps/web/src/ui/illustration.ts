/**
 * Placeholder-art colours — implementation.md §12.2.
 *
 * "Illustration colours inside the camera and 3D mockups (skin, hair, jeans, shoes,
 * olive tee, oxford and linen shirts) are **not** tokens. They belong to placeholder art
 * and are replaced by the camera feed and real garment textures."
 *
 * They live here, in one auditable file, so no component carries a raw colour of its own
 * and every one of them disappears with the placeholder it belongs to.
 */
export const illustration = {
  oliveTee: '#6E7C4E',
  oliveTeeSeam: '#4F5A35',
  oxfordShirt: '#9FB6D4',
  oxfordShirtSeam: '#7D93B0',
  linenShirt: '#D9CDB8',
  skin: '#C8956A',
  skinShadow: '#A9764F',
  hair: '#2B2118',
  jeans: '#3C5A7A',
  shoes: '#2A2E35',
} as const;
