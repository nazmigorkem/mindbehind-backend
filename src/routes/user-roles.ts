import { getUserRoleWithName, getUserRoleWithRoleID, insertUserRole } from 'database/operations/user-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { RolePostBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const UserRolesRouter = Router();

UserRolesRouter.get('/:roleID', async (req, res) => {
	const role = await getUserRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

UserRolesRouter.post('/', validateData(RolePostBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertUserRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

export default UserRolesRouter;
