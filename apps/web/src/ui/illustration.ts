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
  oxfordShirt: '#8FB3DA',
  oxfordShirtSeam: '#6E93BC',
  oxfordShirtCollar: '#A6C4E4',
  oxfordShirtButton: '#F4F7FB',
  linenShirt: '#E6D9BF',
  linenShirtSeam: '#BFAE8A',
  linenShirtCollar: '#EFE5D0',
  skin: '#9A7458',
  hair: '#1C1714',
  tee: '#3B4A5E',
  jeans: '#232C3A',
  shoes: '#11161F',
  guide: 'rgb(255 255 255 / 0.55)',

  // The 2.3 and 4.2 stage figure, which the three.js render replaces.
  figureSkin: '#B07A57',
  figureNeck: '#9C6A4A',
  figureHair: '#1B1512',
  figureJeans: '#2E4A6E',
  figureJeansSeam: '#22395A',
  figureShoes: '#E9ECF1',
  figureShadow: '#000000',
  /** The dashed hem line drawn over the fit map, so it reads on any map colour. */
  fitSeam: '#FFFFFF',
} as const;
