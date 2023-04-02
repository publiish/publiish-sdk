import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('validation error');
    this.errors = errors;
  }

  getResponse() {
    const details = this.errors.reduce(
      (acc, item) => ({
        ...acc,
        [item.property]: Object.values(item.constraints || {}),
      }),
      {},
    );

    return {
      code: 400,
      summary: 'Invalid payload',
      details,
    };
  }
}
