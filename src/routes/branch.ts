import { deleteBranch, getBranchWithID, insertBranch, updateBranch } from 'database/operations/branch';
import { getEmployeeWithEmployeeID, insertEmployee } from 'database/operations/employees';
import { getUserWithID } from 'database/operations/user';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { EmployeePostBodySchema } from 'types/employee';
import { validateData } from 'util/validate';

const BranchRouter = Router();

BranchRouter.get('/:id', async (req, res) => {
	const result = await getBranchWithID(req.params.id);

	if (!result) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	return ResponseFactory.createOKResponse(res, result);
});

BranchRouter.post('/', validateData(BranchPostBodySchema), async (req, res) => {
	const result = await insertBranch(req.body);

	if (!result) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	return ResponseFactory.createOKResponse(res, 'Branch created successfully!');
});

BranchRouter.put('/:id', validateData(BranchPutBodySchema), async (req, res) => {
	const branch = await getBranchWithID(req.params.id);

	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await updateBranch(req.params.id, req.body);

	return ResponseFactory.createOKResponse(res, 'Branch updated successfully!');
});

BranchRouter.delete('/:id', async (req, res) => {
	const branch = await getBranchWithID(req.params.id);

	if (!branch) {
		return ErrorFactory.createNotFoundError(res, 'Branch not found!');
	}

	await deleteBranch(req.params.id);

	return ResponseFactory.createOKResponse(res, 'Branch deleted successfully!');
});

BranchRouter.get('/:branchID/employees/:employeeID', async (req, res) => {
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

BranchRouter.post('/:branchID/employees', validateData(EmployeePostBodySchema), async (req, res) => {
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

export default BranchRouter;
