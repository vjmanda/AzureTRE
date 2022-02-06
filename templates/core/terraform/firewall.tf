resource "azurerm_public_ip" "fwpip" {
  name                = "pip-fw-${var.tre_id}"
  resource_group_name = azurerm_resource_group.core.name
  location            = var.location
  allocation_method   = "Static"
  sku                 = "Standard"

  lifecycle { ignore_changes = [tags] }
}

resource "azurerm_firewall" "fw" {
  depends_on          = [azurerm_public_ip.fwpip]
  name                = "fw-${var.tre_id}"
  resource_group_name = azurerm_resource_group.core.name
  location            = var.location
  ip_configuration {
    name                 = "fw-ip-configuration"
    subnet_id            = module.network.azure_firewall_subnet_id
    public_ip_address_id = azurerm_public_ip.fwpip.id
  }

  lifecycle { ignore_changes = [tags] }
}

resource "azurerm_management_lock" "fw" {
  name       = azurerm_firewall.fw.name
  scope      = azurerm_firewall.fw.id
  lock_level = "CanNotDelete"
  notes      = "Locked to prevent accidental deletion"
}

resource "azurerm_monitor_diagnostic_setting" "firewall" {
  name                       = "diagnostics-firewall-${var.tre_id}"
  target_resource_id         = azurerm_firewall.fw.id
  log_analytics_workspace_id = module.azure_monitor.log_analytics_workspace_id
  log {
    category = "AzureFirewallApplicationRule"
    enabled  = true


    retention_policy {
      enabled = false
      days    = 0
    }
  }

  log {

    category = "AzureFirewallNetworkRule"
    enabled  = true

    retention_policy {
      enabled = false
      days    = 0
    }
  }
  log {

    category = "AzureFirewallDnsProxy"
    enabled  = true

    retention_policy {
      enabled = false
      days    = 0
    }
  }
  log {

    category = "AzureFirewallNetworkRule"
    enabled  = true

    retention_policy {
      enabled = false
      days    = 0
    }
  }

  metric {
    category = "AllMetrics"
    enabled  = true

    retention_policy {
      enabled = false
      days    = 0
    }
  }
}

resource "azurerm_firewall_application_rule_collection" "shared_subnet" {
  name                = "arc-shared_subnet"
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = azurerm_firewall.fw.resource_group_name
  priority            = 100
  action              = "Allow"

  rule {
    name = "admin-resources"

    protocol {
      port = "443"
      type = "Https"
    }

    protocol {
      port = "80"
      type = "Http"
    }

    target_fqdns = [
      "go.microsoft.com",
      "*.azureedge.net",
      "*github.com",
      "*powershellgallery.com",
      "git-scm.com",
      "*githubusercontent.com",
      "*core.windows.net",
      "aka.ms",
      "management.azure.com",
      "graph.microsoft.com",
      "login.microsoftonline.com",
      "aadcdn.msftauth.net",
      "graph.windows.net"
    ]

    source_addresses = module.network.shared_subnet_address_prefixes
  }
}

resource "azurerm_firewall_application_rule_collection" "resource_processor_subnet" {
  name                = "arc-resource_processor_subnet"
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = azurerm_firewall.fw.resource_group_name
  priority            = 101
  action              = "Allow"


  rule {
    name = "package-sources"
    protocol {
      port = "443"
      type = "Https"
    }
    protocol {
      port = "80"
      type = "Http"
    }

    target_fqdns = [
      "packages.microsoft.com",
      "keyserver.ubuntu.com",
      "api.snapcraft.io",
      "azure.archive.ubuntu.com",
      "security.ubuntu.com",
      "entropy.ubuntu.com",
      "download.docker.com",
      "registry-1.docker.io",
      "auth.docker.io",
      "registry.terraform.io",
      "releases.hashicorp.com"
    ]
    source_addresses = module.network.resource_processor_subnet_address_prefixes
  }

  depends_on = [
    azurerm_firewall_application_rule_collection.shared_subnet
  ]
}

resource "azurerm_firewall_network_rule_collection" "general" {
  name                = "general"
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = azurerm_firewall.fw.resource_group_name
  priority            = 100
  action              = "Allow"

  rule {
    name = "time"

    protocols = [
      "UDP"
    ]

    destination_addresses = [
      "*"
    ]

    destination_ports = [
      "123"
    ]
    source_addresses = [
      "*"
    ]
  }

  depends_on = [
    azurerm_firewall_application_rule_collection.resource_processor_subnet
  ]
}

resource "azurerm_firewall_network_rule_collection" "resource_processor_subnet" {
  name                = "nrc-resource_processor_subnet"
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = azurerm_firewall.fw.resource_group_name
  priority            = 101
  action              = "Allow"

  rule {
    name = "AzureServiceTags"

    protocols = [
      "TCP"
    ]

    destination_addresses = [
      "AzureActiveDirectory",
      "AzureResourceManager",
      "AzureContainerRegistry",
      "Storage",
      "AzureKeyVault"
    ]

    destination_ports = [
      "443"
    ]
    source_addresses = module.network.resource_processor_subnet_address_prefixes
  }

  depends_on = [
    azurerm_firewall_network_rule_collection.general
  ]
}

resource "azurerm_firewall_network_rule_collection" "web_app_subnet" {
  name                = "nrc-web_app_subnet"
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = azurerm_firewall.fw.resource_group_name
  priority            = 102
  action              = "Allow"

  rule {
    name = "Azure-Services"

    protocols = [
      "TCP"
    ]

    destination_addresses = [
      "AzureActiveDirectory",
      "AzureContainerRegistry",
      "AzureResourceManager"
    ]

    destination_ports = [
      "443"
    ]
    source_addresses = module.network.web_app_subnet_address_prefixes
  }

  depends_on = [
    azurerm_firewall_network_rule_collection.resource_processor_subnet
  ]
}

resource "azurerm_firewall_application_rule_collection" "web_app_subnet" {
  name                = "arc-web_app_subnet"
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = azurerm_firewall.fw.resource_group_name
  priority            = 102
  action              = "Allow"

  rule {
    name = "microsoft-graph"
    protocol {
      port = "443"
      type = "Https"
    }

    target_fqdns = [
      "graph.microsoft.com"
    ]
    source_addresses = module.network.web_app_subnet_address_prefixes
  }
}
