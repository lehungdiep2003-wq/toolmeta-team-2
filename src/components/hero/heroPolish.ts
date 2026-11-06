/** PA2 depth hierarchy: contact shadow + a wider, softer cast shadow. */
const forest = "#14213f"
export const heroShadowTokens = {
  cardNearShadow: [
    { dx: 0, dy: 3, blur: 2, color: forest, opacity: 0.07 },
    { dx: 2, dy: 18, blur: 14, color: forest, opacity: 0.14 },
  ],
  cardShadow: [
    { dx: 0, dy: 2, blur: 2, color: forest, opacity: 0.05 },
    { dx: 2, dy: 12, blur: 11, color: forest, opacity: 0.11 },
  ],
  notificationShadow: [
    { dx: 1, dy: 9, blur: 12, color: forest, opacity: 0.09 },
  ],
  panelShadow: [
    { dx: 0, dy: 2, blur: 2, color: forest, opacity: 0.06 },
    { dx: 4, dy: 15, blur: 16, color: forest, opacity: 0.13 },
  ],
  coreShadow: [
    { dx: 3, dy: 7, blur: 4, color: "#000d2c", opacity: 0.24 },
    { dx: 12, dy: 24, blur: 20, color: forest, opacity: 0.22 },
  ],
  shieldShadow: [{ dx: 1, dy: 7, blur: 7, color: forest, opacity: 0.13 }],
  smallShadow: [
    { dx: 1, dy: 2, blur: 2, color: "#1c3c6c", opacity: 0.14 },
    { dx: 3, dy: 7, blur: 6, color: forest, opacity: 0.16 },
  ],
} as const
