import { Response } from 'express';

export class ResponseFactory {
	static createResponse(res: Response, data: Record<string, unknown> | string, status: number) {
		return res.status(status).send({ data: typeof data === 'string' ? { message: data } : data, success: true });
	}

	static createOKResponse(res: Response, data: Record<string, unknown> | string) {
		return this.createResponse(res, data, 200);
	}
}
