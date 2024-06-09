import { getEmployeeRoleWithName, getEmployeeRoleWithRoleID, insertEmployeeRole } from 'database/operations/employee-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { RolePostBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const EmployeeRolesRouter = Router();

EmployeeRolesRouter.get('/:roleID', async (req, res) => {
	const role = await getEmployeeRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

EmployeeRolesRouter.post('/', validateData(RolePostBodySchema), async (req, res) => {
	const role = await getEmployeeRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertEmployeeRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

export default EmployeeRolesRouter;
