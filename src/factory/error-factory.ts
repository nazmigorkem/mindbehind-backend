import { Response } from 'express';

type Message = string | string[];

export class ErrorFactory {
	private static createError(res: Response, code: number, message: Message) {
		return res.status(code).send({ message, success: false });
	}

	static createNotFoundError(res: Response, message: Message) {
		return this.createError(res, 404, message);
	}

	static createBadRequestError(res: Response, message: Message) {
		return this.createError(res, 400, message);
	}

	static createInternalServerError(res: Response, message: Message) {
		return this.createError(res, 500, message);
	}

	static createUnauthorizedError(res: Response, message: Message) {
		return this.createError(res, 401, message);
	}

	static createForbiddenError(res: Response, message: Message) {
		return this.createError(res, 403, message);
	}
}
