//Raw ingredient cost for a single recipe
export function calculateRecipeCost(recipe: RecipeIngredient[], ingredients: Ingredient[]): number {
  if (!recipe || recipe.length === 0) return 0;
  const ingredientMap = new Map<string, Ingredient>();
  ingredients.forEach(ing => ingredientMap.set(ing.id, ing));

  let totalCost = 0;
  for (const item of recipe) {
    const ing = ingredientMap.get(item.ingredientId);
    if (!ing) continue;
    totalCost += (Number(item.quantity) || 0) * (Number(ing.unitCost) || 0);
  }
  return Math.round(totalCost * 100) / 100;
}

//Gross Profit Margin, Food Cost %, and 25% threshold alert
export function calculateMenuItemEconomics(
  item: Pick<MenuItem, 'sellingPrice' | 'recipe'>,
  ingredients: Ingredient[],
  thresholdPercent = 25.0
): MenuItemEconomics {
  const sellingPrice = Number(item.sellingPrice) || 0;
  const foodCost = calculateRecipeCost(item.recipe || [], ingredients);
  const grossMargin = Math.round((sellingPrice - foodCost) * 100) / 100;
  
  const grossMarginPercent = sellingPrice > 0 ? Math.round(((grossMargin / sellingPrice) * 100) * 10) / 10 : 0;
  const foodCostPercent = sellingPrice > 0 ? Math.round(((foodCost / sellingPrice) * 100) * 10) / 10 : 0;
  const isHighCostAlert = foodCostPercent > thresholdPercent;

  return { estimatedFoodCost: foodCost, grossMargin, grossMarginPercent, foodCostPercent, isHighCostAlert };
}
