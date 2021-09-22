# Random unique id

locals { 
  short_service_id             = substr(var.tre_resource_id, -4, -1)
  short_workspace_id           = substr(var.workspace_id, -4, -1)
  service_resource_name_suffix = "${var.tre_id}-ws-${local.short_workspace_id}-svc-${local.short_service_id}"

  aml_workspace_name = lower("ml-${substr(local.service_resource_name_suffix, -30, -1)}")
  aml_compute_id               = substr("${var.tre_id}${var.workspace_id}${local.service_id}", -12, -1)
  aml_compute_instance_name    = "ci-${local.aml_compute_id}"
  aml_compute_cluster_name     = "cp-${local.aml_compute_id}"
}
