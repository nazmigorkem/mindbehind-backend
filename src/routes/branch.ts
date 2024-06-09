import { deleteBranch, getBranchWithID, insertBranch, updateBranch } from 'database/operations/branch';
import { addRoleToEmployee, getEmployeeWithEmployeeID, insertEmployee } from 'database/operations/employees';
import { getRoleWithName } from 'database/operations/roles';
import { getUserWithID } from 'database/operations/user';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { EmployeePostBodySchema, EmployeeRolePostBodySchema } from 'types/employee';
import { validateData } from 'util/validate';

const BranchesRouter = Router();

BranchesRouter.get('/:id', async (req, res) => {
	const result = await getBranchWithID(req.params.id);
	if (!result) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	return ResponseFactory.createOKResponse(res, result);
});

BranchesRouter.post('/', validateData(BranchPostBodySchema), async (req, res) => {
	const result = await insertBranch(req.body);
	if (!result) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	return ResponseFactory.createOKResponse(res, 'Branch created successfully!');
});

BranchesRouter.put('/:id', validateData(BranchPutBodySchema), async (req, res) => {
	const branch = await getBranchWithID(req.params.id);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await updateBranch(req.params.id, req.body);

	return ResponseFactory.createOKResponse(res, 'Branch updated successfully!');
});

BranchesRouter.delete('/:id', async (req, res) => {
	const branch = await getBranchWithID(req.params.id);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await deleteBranch(req.params.id);

	return ResponseFactory.createOKResponse(res, 'Branch deleted successfully!');
});

BranchesRouter.get('/:branchID/employees/:employeeID', async (req, res) => {
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

BranchesRouter.post('/:branchID/employees', validateData(EmployeePostBodySchema), async (req, res) => {
	const branch = await getBranchWithID(req.params.branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const user = await getUserWithID(req.body.userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	await insertEmployee({
		userID: req.body.userID,
		branchID: req.params.branchID,
	});

	return ResponseFactory.createOKResponse(res, 'Employee created successfully!');
});

BranchesRouter.post('/:branchID/employees/:employeeID/roles', validateData(EmployeeRolePostBodySchema), async (req, res) => {
	const employee = await getEmployeeWithEmployeeID(req.params.employeeID);
	if (!employee || employee.branchID !== req.params.branchID) {
		return ErrorFactory.createNotFoundError(res, 'Employee not found!');
	}

	const role = await getRoleWithName(req.body.roleName);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	await addRoleToEmployee({
		employeeID: req.params.employeeID,
		roleID: role.id,
	});

	return ResponseFactory.createOKResponse(res, 'Role added to employee successfully!');
});

export default BranchesRouter;
