import {
	deleteRoleFromEmployee,
	doesEmployeeHaveRoleWithID,
	getEmployeeRoleWithName,
	getEmployeeRoleWithRoleID,
	insertEmployeeRole,
	insertRoleToEmployee,
} from 'database/operations/employee-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { RolePostBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const EmployeeRolesRouter = Router();

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

EmployeeRolesRouter.post('/:employeeID/roles/:roleID', ownerAuth, async (req, res) => {
	const employeeID = req.params.employeeID;
	const roleID = req.params.roleID;
	const doesEmployeeHaveRole = await doesEmployeeHaveRoleWithID(employeeID, roleID);

	if (doesEmployeeHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'Employee already has the role!');
	}

	await insertRoleToEmployee({
		employeeID,
		roleID,
	});

	return ResponseFactory.createOKResponse(res, 'Role added to employee successfully!');
});

EmployeeRolesRouter.delete('/:employeeID/roles/:roleID', ownerAuth, async (req, res) => {
	const employeeID = req.params.employeeID;
	const roleID = req.params.roleID;
	const doesEmployeeHaveRole = await doesEmployeeHaveRoleWithID(employeeID, roleID);

	if (!doesEmployeeHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'Employee does not have the role!');
	}

	await deleteRoleFromEmployee(employeeID, roleID);

	return ResponseFactory.createOKResponse(res, 'Role deleted from employee successfully!');
});

export default EmployeeRolesRouter;
