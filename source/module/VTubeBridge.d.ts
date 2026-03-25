export declare class VTubeBridge {
    private apiClient;
    private tokenPath;
    constructor();
    private getAuthToken;
    private setAuthToken;
    init(): Promise<void>;
    triggerExpression(expressionFile: string): Promise<void>;
}
//# sourceMappingURL=VTubeBridge.d.ts.map