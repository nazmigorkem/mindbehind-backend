import { deleteBranch, getBranchWithID, insertBranch, updateBranch } from 'database/operations/branch';
import { getEmployeeWithUserID } from 'database/operations/employees';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { validateData } from 'util/validate';
import EmployeesRouter from './employee';
import EmployeeRolesRouter from './roles';

const BranchesRouter = Router();

BranchesRouter.use('/:branchID/employees', EmployeesRouter);
BranchesRouter.use('/roles', EmployeeRolesRouter);

BranchesRouter.get('/:branchID', employeeAuth, async (req, res) => {
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

BranchesRouter.post('/', ownerAuth, validateData(BranchPostBodySchema), async (req, res) => {
	const branchID = await insertBranch(req.body);

	return ResponseFactory.createOKResponse(res, { branchID });
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

export default BranchesRouter;
