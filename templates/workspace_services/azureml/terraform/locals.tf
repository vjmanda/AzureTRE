# Random unique id
resource "random_string" "unique_id" {
  length      = 4
  min_numeric = 4
}

locals {
  short_service_id             = substr(var.tre_resource_id, -4, -1)

  short_workspace_id           = substr(var.workspace_id, -4, -1)
  service_resource_name_suffix = "${var.tre_id}-ws-${var.workspace_id}-svc-${local.short_service_id}"
  allowed_urls                 = ["graph.windows.net", "ml.azure.com", "login.microsoftonline.com", "aadcdn.msftauth.net", "graph.microsoft.com", "management.azure.com", "viennaglobal.azurecr.io"]
  allowed_service_tags         = ["Storage.${data.azurerm_resource_group.ws.location}", "AzureContainerRegistry"]

  workspace_name = lower("ml-${substr(local.service_resource_name_suffix, -30, -1)}")
}
