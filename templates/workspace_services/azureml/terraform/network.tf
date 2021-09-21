
data "azurerm_network_security_group" "ws" {
  name                = "nsg-ws"
  resource_group_name = data.azurerm_resource_group.ws.name
}


data "external" "nsg_rule_priorities_inbound" {
  program = ["bash", "-c", "./get_nsg_priorities.sh"]

  query = {
    nsg_name            = data.azurerm_network_security_group.ws.name
    resource_group_name = data.azurerm_resource_group.ws.name
    direction           = "Inbound"
  }
  depends_on = [
    null_resource.az_login_sp,
    null_resource.az_login_msi
  ]
}

data "external" "nsg_rule_priorities_outbound" {
  program = ["bash", "-c", "./get_nsg_priorities.sh"]

  query = {
    nsg_name            = data.azurerm_network_security_group.ws.name
    resource_group_name = data.azurerm_resource_group.ws.name
    direction           = "Outbound"
  }
  depends_on = [
    null_resource.az_login_sp,
    null_resource.az_login_msi
  ]
}

resource "azurerm_network_security_rule" "allow-BatchNodeManagement-inbound-29877" {
  access                      = "Allow"
  destination_port_range      = "29877"
  destination_address_prefix  = "VirtualNetwork"
  source_address_prefix       = "BatchNodeManagement"
  direction                   = "Inbound"
  name                        = "${local.short_service_id}-BatchNodeManagement-inbound-29877"
  network_security_group_name = data.azurerm_network_security_group.ws.name
  priority                    = data.external.nsg_rule_priorities_inbound.result.nsg_rule_priority
  protocol                    = "TCP"
  resource_group_name         = data.azurerm_resource_group.ws.name
  source_port_range           = "*"
}

resource "azurerm_network_security_rule" "allow-BatchNodeManagement-inbound-29876" {
  access                      = "Allow"
  destination_port_range      = "29876"
  destination_address_prefix  = "VirtualNetwork"
  source_address_prefix       = "BatchNodeManagement"
  direction                   = "Inbound"
  name                        = "${local.short_service_id}-BatchNodeManagement-inbound-29876"
  network_security_group_name = data.azurerm_network_security_group.ws.name
  priority                    = data.external.nsg_rule_priorities_inbound.result.nsg_rule_priority + 1
  protocol                    = "TCP"
  resource_group_name         = data.azurerm_resource_group.ws.name
  source_port_range           = "*"
}

resource "azurerm_network_security_rule" "allow-AzureMachineLearning-inbound-44224" {
  access                      = "Allow"
  destination_port_range      = "44224"
  destination_address_prefix  = "VirtualNetwork"
  source_address_prefix       = "*"
  direction                   = "Inbound"
  name                        = "${local.short_service_id}-AzureMachineLearning-inbound-44224"
  network_security_group_name = data.azurerm_network_security_group.ws.name
  priority                    = data.external.nsg_rule_priorities_inbound.result.nsg_rule_priority + 2
  protocol                    = "TCP"
  resource_group_name         = data.azurerm_resource_group.ws.name
  source_port_range           = "*"
}

resource "azurerm_network_security_rule" "allow-Outbound_Storage_445" {
  access                      = "Allow"
  destination_port_range      = "445"
  destination_address_prefix  = "Storage"
  source_address_prefix       = "VirtualNetwork"
  direction                   = "Outbound"
  name                        = "${local.short_service_id}-allow-Outbound_Storage_445"
  network_security_group_name = data.azurerm_network_security_group.ws.name
  priority                    = data.external.nsg_rule_priorities_outbound.result.nsg_rule_priority
  protocol                    = "TCP"
  resource_group_name         = data.azurerm_resource_group.ws.name
  source_port_range           = "*"
}
