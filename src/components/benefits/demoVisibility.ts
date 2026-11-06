/** A majority of the displayable area, rather than 55% of a tall mobile section. */
export function hasMajorityVisible(
  sectionHeight: number,
  viewportHeight: number,
  visibleHeight: number,
  sectionWidth: number,
  viewportWidth: number,
  visibleWidth: number,
) {
  return (
    visibleHeight >= Math.min(sectionHeight, viewportHeight) * 0.55 &&
    visibleWidth >= Math.min(sectionWidth, viewportWidth) * 0.55
  )
}
