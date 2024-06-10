import { getUserRoleWithName, getUserRoleWithRoleID, getUserRoles, insertUserRole } from 'database/operations/user-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { RolePostBodySchema, RolePutBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const UserRolesRouter = Router();

UserRolesRouter.get('/', async (req, res) => {
	const roles = await getUserRoles();
	return ResponseFactory.createOKResponse(res, { roles });
});

UserRolesRouter.post('/', validateData(RolePostBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertUserRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

UserRolesRouter.get('/:roleID', async (req, res) => {
	const role = await getUserRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

UserRolesRouter.put('/:roleID', validateData(RolePutBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertUserRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

export default UserRolesRouter;
