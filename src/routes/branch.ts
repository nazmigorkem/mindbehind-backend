import { deleteBranch, getBranchWithID, insertBranch, updateBranch } from 'database/operations/branch';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { BranchPostBodySchema, BranchPutBodySchema } from 'types/branch';
import { validateData } from 'util/validate';

const BranchRouter = Router();

BranchRouter.get('/:id', async (req, res) => {
	const result = await getBranchWithID(req.params.id);
	if (!result) {
		ErrorFactory.createNotFoundError(res, 'Branch not found!');
		return;
	}

	ResponseFactory.createOKResponse(res, result);
});

BranchRouter.post('/', validateData(BranchPostBodySchema), async (req, res) => {
	const result = await insertBranch(req.body);

	if (!result) {
		ErrorFactory.createNotFoundError(res, 'Branch not found!');
		return;
	}

	ResponseFactory.createOKResponse(res, 'Branch created successfully!');
});

BranchRouter.put('/:id', validateData(BranchPutBodySchema), async (req, res) => {
	const branch = await getBranchWithID(req.params.id);

	if (!branch) {
		ErrorFactory.createNotFoundError(res, 'Branch not found!');
		return;
	}

	await updateBranch(req.params.id, req.body);

	ResponseFactory.createOKResponse(res, 'Branch updated successfully!');
});

BranchRouter.delete('/:id', async (req, res) => {
	const branch = await getBranchWithID(req.params.id);

	if (!branch) {
		ErrorFactory.createNotFoundError(res, 'Branch not found!');
		return;
	}

	await deleteBranch(req.params.id);

	ResponseFactory.createOKResponse(res, 'Branch deleted successfully!');
});

export default BranchRouter;
