import { getRoleWithName, getRoleWithRoleID, insertRole } from 'database/operations/roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { RolePostBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const RolesRouter = Router();

RolesRouter.get('/:id', async (req, res) => {
	const role = await getRoleWithRoleID(req.params.id);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

RolesRouter.post('/', validateData(RolePostBodySchema), async (req, res) => {
	const role = await getRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	await insertRole(req.body);

	return ResponseFactory.createOKResponse(res, 'Role created successfully!');
});

export default RolesRouter;
