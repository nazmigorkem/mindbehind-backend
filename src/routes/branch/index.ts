import { deleteBranch, getBranchWithID, getBranches, insertBranch, updateBranch } from 'database/operations/branch';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { employeeAuth, ownerAuth } from 'middlewares/auth';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { validateData } from 'util/validate';
import EmployeesRouter from './employee';
import EmployeeRolesRouter from './roles';

const BranchesRouter = Router();

BranchesRouter.use('/', EmployeesRouter);
BranchesRouter.use('/roles', EmployeeRolesRouter);

BranchesRouter.get('/', employeeAuth, async (req, res) => {
	const branches = await getBranches();

	return ResponseFactory.createOKResponse(res, { branches });
});

BranchesRouter.get('/:branchID', employeeAuth, async (req, res) => {
	const branchID = req.params.branchID;

	const result = await getBranchWithID(branchID);
	if (!result) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	return ResponseFactory.createOKResponse(res, result);
});

BranchesRouter.post('/', ownerAuth, validateData(BranchPostBodySchema), async (req, res) => {
	const branchID = await insertBranch(req.body);

	return ResponseFactory.createOKResponse(res, { branchID });
});

BranchesRouter.put('/:branchID', ownerAuth, validateData(BranchPutBodySchema), async (req, res) => {
	const branchID = req.params.branchID;

	const branch = await getBranchWithID(branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await updateBranch(branchID, req.body);

	return ResponseFactory.createOKResponse(res, 'Branch updated successfully!');
});

BranchesRouter.delete('/:branchID', ownerAuth, async (req, res) => {
	const branchID = req.params.branchID;

	const branch = await getBranchWithID(branchID);
	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await deleteBranch(branchID);

	return ResponseFactory.createOKResponse(res, 'Branch deleted successfully!');
});

export default BranchesRouter;
