import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { Position } from "../../entities/Position";
import {
  CreatePositionInput,
  UpdatePositionInput,
  PositionResponse,
  PositionListResponse,
} from "../types/PositionTypes";
import { AppDataSource } from "../../data-source";

@Resolver()
export class PositionResolver {
  // Get all positions
  @Query(() => PositionListResponse)
  async getAllPositions(): Promise<PositionListResponse> {
    try {
      const positionRepository = AppDataSource.getRepository(Position);
      const positions = await positionRepository.find({
        relations: ["course", "role", "creator"],
        order: { created_at: "DESC" },
      });
      return { positions };
    } catch (error) {
      return { positions: [], error: "Failed to fetch positions" };
    }
  }

  // Get position by id
  @Query(() => PositionResponse)
  async getPosition(
    @Arg("id", () => ID) id: string,
  ): Promise<PositionResponse> {
    try {
      const positionRepository = AppDataSource.getRepository(Position);
      const position = await positionRepository.findOne({
        where: { id },
        relations: ["course", "role", "creator", "applications"],
      });

      if (!position) {
        return { error: "Position not found" };
      }

      return { position };
    } catch (error) {
      return { error: "Failed to fetch position" };
    }
  }

  // Create a position
  @Mutation(() => PositionResponse)
  async createPosition(
    @Arg("input") input: CreatePositionInput,
  ): Promise<PositionResponse> {
    try {
      const positionRepository = AppDataSource.getRepository(Position);
      const position = positionRepository.create(input);
      const savedPosition = await positionRepository.save(position);
      return { position: savedPosition };
    } catch (error) {
      return { error: "Failed to create position" };
    }
  }

  // Update a position
  @Mutation(() => PositionResponse)
  async updatePosition(
    @Arg("input") input: UpdatePositionInput,
  ): Promise<PositionResponse> {
    try {
      const positionRepository = AppDataSource.getRepository(Position);
      const position = await positionRepository.findOne({
        where: { id: input.id },
      });

      if (!position) {
        return { error: "Position not found" };
      }

      const { id, ...updateData } = input;
      await positionRepository.update(id, updateData);

      const updatedPosition = await positionRepository.findOne({
        where: { id },
        relations: ["course", "role", "creator"],
      });

      return { position: updatedPosition! };
    } catch (error) {
      return { error: "Failed to update position" };
    }
  }

  // Close a position
  @Mutation(() => PositionResponse)
  async closePosition(
    @Arg("id", () => ID) id: string,
  ): Promise<PositionResponse> {
    try {
      const positionRepository = AppDataSource.getRepository(Position);
      const position = await positionRepository.findOne({
        where: { id },
      });

      if (!position) {
        return { error: "Position not found" };
      }

      position.status = "closed";
      const updatedPosition = await positionRepository.save(position);

      return { position: updatedPosition };
    } catch (error) {
      return { error: "Failed to close position" };
    }
  }
}
