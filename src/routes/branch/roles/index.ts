import {
	deleteEmployeeRole,
	getEmployeeRoleWithName,
	getEmployeeRoleWithRoleID,
	getEmployeeRoles,
	insertEmployeeRole,
	updateEmployeeRole,
} from 'database/operations/employee-roles';
import { getEmployeeWithRoleID } from 'database/operations/employees';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { RolePostBodySchema, RolePutBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const EmployeeRolesRouter = Router();

EmployeeRolesRouter.get('/', employeeAuth, async (req, res) => {
	const roles = await getEmployeeRoles();
	return ResponseFactory.createOKResponse(res, { roles });
});

EmployeeRolesRouter.get('/:roleID', employeeAuth, async (req, res) => {
	const role = await getEmployeeRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

EmployeeRolesRouter.post('/', ownerAuth, validateData(RolePostBodySchema), async (req, res) => {
	const role = await getEmployeeRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertEmployeeRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

EmployeeRolesRouter.put('/:roleID', ownerAuth, validateData(RolePutBodySchema), async (req, res) => {
	const role = await getEmployeeRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	if (Object.keys(req.body).length === 0) {
		return ErrorFactory.createBadRequestError(res, 'No data provided to update!');
	}

	const roleID = await updateEmployeeRole(req.params.roleID, req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

EmployeeRolesRouter.delete('/:roleID', ownerAuth, async (req, res) => {
	const roleID = req.params.roleID;
	const role = await getEmployeeRoleWithRoleID(roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	const employeeWithRole = await getEmployeeWithRoleID(roleID);
	if (employeeWithRole) {
		return ErrorFactory.createBadRequestError(res, 'Role is assigned to an employee!');
	}

	await deleteEmployeeRole(roleID);

	return ResponseFactory.createOKResponse(res, 'Role deleted successfully!');
});

export default EmployeeRolesRouter;
