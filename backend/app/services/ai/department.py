DEPARTMENTS = {
    "pothole": "Road Maintenance",
    "garbage": "Sanitation",
    "broken_streetlight": "Electrical",
    "water_leakage": "Water Supply",
    "fallen_tree": "Parks & Forestry",
    "other": "Municipal Office",
}


def get_department(category: str) -> str:
    return DEPARTMENTS.get(category, "Municipal Office")