import { mapMaterialFromDatabase } from "../mappers/material.mapper";
import {
    getMaterialByIdFromDatabase,
    getMaterialsFromDatabase,
  } from "../repositories/material.repository";

export async function getMaterials() {
  const materials =
    await getMaterialsFromDatabase();

  return materials.map(
    mapMaterialFromDatabase
  );
}
export async function getMaterialById(
    materialId: string
  ) {
    const material =
      await getMaterialByIdFromDatabase(
        materialId
      );
  
    if (!material) {
      return null;
    }
  
    return mapMaterialFromDatabase(
      material
    );
  }