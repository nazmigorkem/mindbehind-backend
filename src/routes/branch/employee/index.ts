import { getBranchWithID } from '#database/operations/branch.js';
import {
	deleteRoleFromEmployee,
	doesEmployeeHaveRoleWithID,
	getEmployeeRoleWithRoleID,
	insertRoleToEmployee,
} from '#database/operations/employee-roles.js';
import { getEmployeeWithEmployeeID, getEmployeeWithUserID, insertEmployee } from '#database/operations/employees.js';
import { getUserWithID } from '#database/operations/user.js';
import { ErrorFactory } from '#factory/error-factory.js';
import { ResponseFactory } from '#factory/response-factory.js';
import { employeeAuth, ownerAuth } from '#middlewares/auth.js';
import { EmployeePostBodySchema } from '#types/employee.js';
import { validateData } from '#util/validate.js';
import { Request, Router } from 'express';

const EmployeesRouter = Router();

EmployeesRouter.get('/:branchID/employees/:employeeID', employeeAuth, async (req: Request<{ branchID: string; employeeID: string }>, res) => {
	const branchID = req.params.branchID;
	const employeeID = req.params.employeeID;

	const branch = await getBranchWithID(branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const employee = await getEmployeeWithEmployeeID(employeeID);
	if (!employee) {
		return ErrorFactory.createNotFoundError(res, 'Employee not found!');
	}

	return ResponseFactory.createOKResponse(res, employee);
});

EmployeesRouter.post('/:branchID/employees', ownerAuth, validateData(EmployeePostBodySchema), async (req, res) => {
	const branchID = req.params.branchID;
	const userID = req.body.userID;

	const branch = await getBranchWithID(branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	const employee = await getEmployeeWithUserID(branchID, userID);
	if (employee) {
		return ErrorFactory.createConflictError(res, 'This user already is an employee of this bvranch!');
	}

	const employeeID = await insertEmployee({
		userID: req.body.userID,
		branchID: req.params.branchID,
	});

	return ResponseFactory.createOKResponse(res, { employeeID });
});

EmployeesRouter.post('/:branchID/employees/:employeeID/roles/:roleID', ownerAuth, async (req, res) => {
	const employeeID = req.params.employeeID;
	const roleID = req.params.roleID;
	const branchID = req.params.branchID;

	const branch = await getBranchWithID(branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const employee = await getEmployeeWithEmployeeID(employeeID);
	if (!employee) {
		return ErrorFactory.createNotFoundError(res, 'Employee not found!');
	}

	const role = await getEmployeeRoleWithRoleID(roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

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

EmployeesRouter.delete('/:branchID/employees/:employeeID/roles/:roleID', ownerAuth, async (req, res) => {
	const employeeID = req.params.employeeID;
	const roleID = req.params.roleID;
	const branchID = req.params.branchID;

	const branch = await getBranchWithID(branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const employee = await getEmployeeWithEmployeeID(employeeID);
	if (!employee) {
		return ErrorFactory.createNotFoundError(res, 'Employee not found!');
	}

	// No need for role existence check. If employee does not have it then it is already deleted or non-existent.
	const doesEmployeeHaveRole = await doesEmployeeHaveRoleWithID(employeeID, roleID);
	if (!doesEmployeeHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'Employee does not have the role!');
	}

	await deleteRoleFromEmployee(employeeID, roleID);

	return ResponseFactory.createOKResponse(res, 'Role deleted from employee successfully!');
});

export default EmployeesRouter;
