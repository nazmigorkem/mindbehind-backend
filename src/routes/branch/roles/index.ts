import {
	deleteEmployeeRole,
	getEmployeeRoleWithName,
	getEmployeeRoleWithRoleID,
	getEmployeeRoles,
	insertEmployeeRole,
	updateEmployeeRole,
} from '#database/operations/employee-roles.js';
import { getEmployeeWithRoleID } from '#database/operations/employees.js';
import { ErrorFactory } from '#factory/error-factory.js';
import { ResponseFactory } from '#factory/response-factory.js';
import { employeeAuth, ownerAuth } from '#middlewares/auth.js';
import { RolePostBodySchema, RolePutBodySchema } from '#types/roles.js';
import { validateData } from '#util/validate.js';
import { Router } from 'express';

const EmployeeRolesRouter = Router();

EmployeeRolesRouter.get('/', employeeAuth, async (req, res) => {
	const roles = await getEmployeeRoles();
	return ResponseFactory.createOKResponse(res, { roles });
});

EmployeeRolesRouter.get('/:roleID', employeeAuth, async (req, res) => {
	const roleID = req.params.roleID;

	const role = await getEmployeeRoleWithRoleID(roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

EmployeeRolesRouter.post('/', ownerAuth, validateData(RolePostBodySchema), async (req, res) => {
	const roleName = req.body.name;

	const role = await getEmployeeRoleWithName(roleName);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertEmployeeRole({
		name: roleName,
	});

	return ResponseFactory.createOKResponse(res, { roleID });
});

EmployeeRolesRouter.put('/:roleID', ownerAuth, validateData(RolePutBodySchema), async (req, res) => {
	const roleName = req.body.name;
	const roleID = req.params.roleID;

	const role = await getEmployeeRoleWithName(roleName);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	if (Object.keys(req.body).length === 0) {
		return ErrorFactory.createBadRequestError(res, 'No data provided to update!');
	}

	await updateEmployeeRole(roleID, {
		name: roleName,
	});

	return ResponseFactory.createOKResponse(res, 'Role updated successfully!');
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
