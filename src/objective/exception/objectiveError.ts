export class ObjectiveNotFoundException extends Error {
  constructor(errorMessage: string, objectiveId: string) {
    super(`${errorMessage} ${objectiveId}`);
  }
}
export class ObjectiveTitleDuplicateException extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
  }
}
