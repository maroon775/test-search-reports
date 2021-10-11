export const item1 = {
    "id": 1,
    "category": "Allergies",
    "name": "Multiple Chemical Sensitivity",
    "keywords": ["allergy", "allergies", "allergic", "allergen", "chemical", "sensitive", "sensitivity"],
};
export const item2 = {
    "id": 2,
    "category": "Health & Wellness",
    "name": "Rosacea",
    "keywords": ["rosacea", "skin", "red", "face"],
};
export const item3 = {
    "id": 3,
    "category": "Traits",
    "name": "Optimism vs Pessimism",
    "keywords": ["worry", "happiness", "carbs", "mood", "relax"],
};
export const item4 = {
    "category": "Traits",
    "name": "Prosocial Behavior",
    "id": 4,
    "keywords": ["oxytocin", "love", "happiness", "bonding", "mood"],
};

export const getArrayItems: () => typeof item1[] = () => [item1, item2, item3, item4];