export function calculateWeightedAverageCost(
  existingQuantity: number,
  existingUnitCost: number,
  incomingQuantity: number,
  incomingUnitCost: number
): number {
  const currentQty = Math.max(0, existingQuantity);
  const incQty = Math.max(0, incomingQuantity);
  if (currentQty + incQty <= 0) return incomingUnitCost;

}
