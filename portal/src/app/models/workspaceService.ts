export class WorkspaceService {
    id: string;
    resourceTemplateName: string;
    workspaceId: string;
    resourceTemplateParameters: {

        display_name: string;
        description: string;
    }
    deployment: {
        status: string;
        message: string;
    }
}
