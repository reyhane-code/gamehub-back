import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateOptions, DestroyOptions, Model, UpdateOptions } from "sequelize";

export const findOneById = async (respository: any, entityId: number, modelName: string) => {
    const entity = await respository.findOne({
        where: { id: entityId },
    });
    if (!entity) {
        throw new NotFoundException(`No ${modelName} was found!`);
    }
    return entity;
}
export const updateEntity = async <T extends Model>(
    repository: {
        update: (values: Partial<T>, options?: UpdateOptions) => Promise<[number, T[]]>;
    },
    modelName: string,
    entityId: number,
    body: Partial<T>,
    userId?: number
): Promise<T> => {
    await findOneById(repository, entityId, modelName);

    const condition = userId ? {
        id: entityId, user_id: userId
    } : {
        id: entityId
    }
    try {
        const [numberOfAffectedRows, [updatedEntity]] = await repository.update(body, {
            where: condition,
            returning: true,
        });

        if (numberOfAffectedRows === 0) {
            throw new BadRequestException('No rows were updated. Please check the entity ID and user ID.');
        }

        return updatedEntity;
    } catch (error) {
        console.error('Update error:', error);
        throw new BadRequestException('Something went wrong during the update!');
    }
}


export const deleteEntity = async (
    repository: {
        destroy: (options?: DestroyOptions) => Promise<number>;
    },
    modelName: string,
    entityId: number,
    isSoftDelete: boolean,
    userId?: number,
): Promise<void> => {
    await findOneById(repository, entityId, modelName);

    try {
        const options: DestroyOptions = {
            where: { id: entityId },
            ...(userId !== undefined ? { user_id: userId } : {}),
            ...(isSoftDelete ? {} : { force: true }),
        };

        const deletedCount = await repository.destroy(options);

        if (deletedCount === 0) {
            throw new BadRequestException('No entity found to delete. Please check the entity ID and user ID.');
        }
    } catch (error) {
        console.error('Delete error:', error);
        throw new BadRequestException('Something went wrong during the deletion!');
    }
}

