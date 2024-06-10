import { getBranchWithID } from 'database/operations/branch';
import { getEmployeeRoleWithName } from 'database/operations/employee-roles';
import { addRoleToEmployee, getEmployeeWithEmployeeID, insertEmployee } from 'database/operations/employees';
import { getUserWithID } from 'database/operations/user';
import { Request, Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { EmployeePostBodySchema, EmployeeRolePostBodySchema } from 'types/employee';
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

EmployeesRouter.post('/:employeeID/roles', ownerAuth, validateData(EmployeeRolePostBodySchema), async (req, res) => {
	const employee = await getEmployeeWithEmployeeID(req.params.employeeID);
	if (!employee || employee.branchID !== req.params.branchID) {
		return ErrorFactory.createNotFoundError(res, 'Employee not found!');
	}

	const role = await getEmployeeRoleWithName(req.body.roleName);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	await addRoleToEmployee({
		employeeID: req.params.employeeID,
		roleID: role.id,
	});

	return ResponseFactory.createOKResponse(res, 'Role added to employee successfully!');
});

export default EmployeesRouter;
