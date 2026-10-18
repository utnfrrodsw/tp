export class FailureType {
    constructor(
        public failureDescription: string,
        public estimatedImport: number,
        public id_failure_type?: string,
    ) { }
}