import { deleteBranch, getBranchWithID, insertBranch, updateBranch } from 'database/operations/branch';
import { getEmployeeRoleWithName } from 'database/operations/employee-roles';
import { addRoleToEmployee, getEmployeeWithUserID, insertEmployee } from 'database/operations/employees';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { ownerAuth } from 'middlewares/auth';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { validateData } from 'util/validate';
import EmployeesRouter from './employee';

const BranchesRouter = Router();

BranchesRouter.use('/:branchID/employees', EmployeesRouter);

BranchesRouter.get('/:branchID', async (req, res) => {
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

	const ownerRole = await getEmployeeRoleWithName('owner');
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
