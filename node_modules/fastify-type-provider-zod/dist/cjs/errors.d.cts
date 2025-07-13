import { type FastifyErrorConstructor } from "@fastify/error";
import type { FastifyError } from "fastify";
import type { FastifySchemaValidationError } from "fastify/types/schema";
import type { $ZodError } from "zod/v4/core";
export declare const InvalidSchemaError: FastifyErrorConstructor<{
	code: string;
}, [string]>;
declare const ZodFastifySchemaValidationErrorSymbol: symbol;
export type ZodFastifySchemaValidationError = FastifySchemaValidationError & {
	[ZodFastifySchemaValidationErrorSymbol]: true;
};
declare const ResponseSerializationBase: FastifyErrorConstructor<{
	code: string;
}, [{
	cause: $ZodError;
}]>;
export declare class ResponseSerializationError extends ResponseSerializationBase {
	method: string;
	url: string;
	cause: $ZodError;
	constructor(method: string, url: string, options: {
		cause: $ZodError;
	});
}
export declare function isResponseSerializationError(value: unknown): value is ResponseSerializationError;
export declare function hasZodFastifySchemaValidationErrors(error: unknown): error is Omit<FastifyError, "validation"> & {
	validation: ZodFastifySchemaValidationError[];
};
export declare function createValidationError(error: $ZodError): ZodFastifySchemaValidationError[];
export {};
