export class UserResource {
    id: string;
    ownerId: string;
    workspaceId: string;
    parentWorkspaceServiceId: string;
    resourceTemplateName: string;
    resourceTemplateParameters: {
        display_name: string;
        description: string;
    }
    deployment: {
        status: string;
        message: string;
    }
}
