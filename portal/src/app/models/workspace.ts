
export class Workspace {
    id: string;
    resourceTemplateParameters: {
        workspace_id: string;
        display_name: string;
        description: string;
    }
    deployment: {
        status: string;
        message: string;
    }
}
