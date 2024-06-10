import { getEmployeeRoleWithName, getEmployeeRoleWithRoleID, insertEmployeeRole, insertRoleToEmployee } from 'database/operations/employee-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { AddRolePostBodySchema, RolePostBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const EmployeeRolesRouter = Router();

EmployeeRolesRouter.get('/:roleID', employeeAuth, async (req, res) => {
	const role = await getEmployeeRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

EmployeeRolesRouter.post('/', employeeAuth, validateData(RolePostBodySchema), async (req, res) => {
	const role = await getEmployeeRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertEmployeeRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

EmployeeRolesRouter.post('/:employeeID', ownerAuth, validateData(AddRolePostBodySchema), async (req, res) => {
	const role = await getEmployeeRoleWithName(req.body.roleName);

	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	await insertRoleToEmployee({
		employeeID: req.params.employeeID,
		roleID: role.id,
	});

	return ResponseFactory.createOKResponse(res, { roleID: role.id });
});

export default EmployeeRolesRouter;
