import { deleteBranch, getBranchWithID, insertBranch, updateBranch } from 'database/operations/branch';
import { addRoleToEmployee, getEmployeeWithEmployeeID, getEmployeeWithUserID, insertEmployee } from 'database/operations/employees';
import { getRoleWithName } from 'database/operations/roles';
import { getUserWithID } from 'database/operations/user';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeerAuth, ownerAuth } from 'middlewares/auth';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { EmployeePostBodySchema, EmployeeRolePostBodySchema } from 'types/employee';
import { validateData } from 'util/validate';

const BranchesRouter = Router();

BranchesRouter.get('/:branchID', employeerAuth, async (req, res) => {
	const result = await getBranchWithID(req.params.branchID);
	if (!result) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	const { userID } = req.user!;
	const user = await getEmployeeWithUserID(req.params.branchID, userID);
	if (!user) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! You are not an employee of this branch!');
	}

	return ResponseFactory.createOKResponse(res, result);
});

BranchesRouter.post('/', validateData(BranchPostBodySchema), async (req, res) => {
	const { userID } = req.user!;
	const branchID = await insertBranch(req.body);
	const employeeID = await insertEmployee({
		userID: userID,
		branchID: branchID,
	});

	const ownerRole = await getRoleWithName('owner');
	if (!ownerRole) {
		return ErrorFactory.createInternalServerError(res, 'Something went wrong while adding the role!');
	}

	await addRoleToEmployee({
		employeeID: employeeID,
		roleID: ownerRole.id,
	});

	return ResponseFactory.createOKResponse(res, { branchID, employeeID });
});

BranchesRouter.put('/:branchID', ownerAuth, validateData(BranchPutBodySchema), async (req, res) => {
	const branch = await getBranchWithID(req.params.id);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await updateBranch(req.params.id, req.body);

	return ResponseFactory.createOKResponse(res, 'Branch updated successfully!');
});

BranchesRouter.delete('/:branchID', ownerAuth, async (req, res) => {
	const branch = await getBranchWithID(req.params.branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await deleteBranch(req.params.branchID);

	return ResponseFactory.createOKResponse(res, 'Branch deleted successfully!');
});

BranchesRouter.get('/:branchID/employees/:employeeID', employeerAuth, async (req, res) => {
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

BranchesRouter.post('/:branchID/employees', ownerAuth, validateData(EmployeePostBodySchema), async (req, res) => {
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

BranchesRouter.post('/:branchID/employees/:employeeID/roles', ownerAuth, validateData(EmployeeRolePostBodySchema), async (req, res) => {
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
