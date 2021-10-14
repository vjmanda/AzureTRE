export class UserResource {
    id: string;
    ownerId: string;
    workspaceId: string;
    parentWorkspaceServiceId: string;
    templateName: string;
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
