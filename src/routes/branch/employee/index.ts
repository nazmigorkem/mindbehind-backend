import { getBranchWithID } from 'database/operations/branch';
import { deleteRoleFromEmployee, doesEmployeeHaveRoleWithID, insertRoleToEmployee } from 'database/operations/employee-roles';
import { getEmployeeWithEmployeeID, insertEmployee } from 'database/operations/employees';
import { getUserWithID } from 'database/operations/user';
import { Request, Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { EmployeePostBodySchema } from 'types/employee';
import { validateData } from 'util/validate';

const EmployeesRouter = Router();

EmployeesRouter.get('/:employeeID', employeeAuth, async (req: Request<{ branchID: string; employeeID: string }>, res) => {
	const branch = await getBranchWithID(req.params.branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const employee = await getEmployeeWithEmployeeID(req.params.employeeID);
	if (!employee) {
		return ErrorFactory.createNotFoundError(res, 'Employee not found!');
	}

	return ResponseFactory.createOKResponse(res, employee);
});

EmployeesRouter.post('/', ownerAuth, validateData(EmployeePostBodySchema), async (req, res) => {
	const branch = await getBranchWithID(req.params.branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const user = await getUserWithID(req.body.userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	const employeeID = await insertEmployee({
		userID: req.body.userID,
		branchID: req.params.branchID,
	});

	return ResponseFactory.createOKResponse(res, { employeeID });
});

EmployeesRouter.post('/:employeeID/roles/:roleID', ownerAuth, async (req, res) => {
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

EmployeesRouter.delete('/:employeeID/roles/:roleID', ownerAuth, async (req, res) => {
	const employeeID = req.params.employeeID;
	const roleID = req.params.roleID;
	const doesEmployeeHaveRole = await doesEmployeeHaveRoleWithID(employeeID, roleID);

	if (!doesEmployeeHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'Employee does not have the role!');
	}

	await deleteRoleFromEmployee(employeeID, roleID);

	return ResponseFactory.createOKResponse(res, 'Role deleted from employee successfully!');
});

export default EmployeesRouter;
