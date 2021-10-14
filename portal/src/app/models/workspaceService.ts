export class WorkspaceService {
    id: string;
    templateName: string;
    templateVersion: string;
    workspaceId: string;
    properties: {

        display_name: string;
        description: string;
        connection_uri: string;
    }
    deployment: {
        status: string;
        message: string;
    }
}
