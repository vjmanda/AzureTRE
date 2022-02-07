.PHONY: bootstrap-init mgmt-deploy mgmt-destroy build-api-image push-api-image deploy-tre destroy-tre letsencrypt

SHELL:=/bin/bash
ROOTPATH:=$(shell pwd)

IMAGE_NAME_PREFIX?="microsoft/azuretre"
FULL_CONTAINER_REGISTRY_NAME?="$${ACR_NAME}.azurecr.io"
FULL_IMAGE_NAME_PREFIX:=`echo "${FULL_CONTAINER_REGISTRY_NAME}/${IMAGE_NAME_PREFIX}" | tr A-Z a-z`

target_title = @echo -e "\n\e[34m»»» 🧩 \e[96m$(1)\e[0m..."

all: bootstrap mgmt-deploy images tre-deploy
images: build-and-push-api build-and-push-resource-processor build-and-push-gitea build-and-push-guacamole

build-and-push-api: build-api-image push-api-image
build-and-push-resource-processor: build-resource-processor-vm-porter-image push-resource-processor-vm-porter-image
build-and-push-gitea: build-gitea-image push-gitea-image
build-and-push-guacamole: build-guacamole-image push-guacamole-image

bootstrap:
	$(call target_title, "Bootstrap Terraform") \
	&& . ./devops/scripts/check_dependencies.sh nodocker \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& cd ./devops/terraform && ./bootstrap.sh

mgmt-deploy:
	$(call target_title, "Deploying management infrastructure") \
	&& . ./devops/scripts/check_dependencies.sh nodocker \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& cd ./devops/terraform && ./deploy.sh

mgmt-destroy:
	$(call target_title, "Destroying management infrastructure") \
	. ./devops/scripts/check_dependencies.sh nodocker \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& cd ./devops/terraform && ./destroy.sh

# A recipe for building images. Parameters:
# 1. Image name suffix
# 2. Version file path
# 3. Docker file path
# 4. Docoer context path
# Example: $(call build_image,"api","./api_app/_version.py","api_app/Dockerfile","./api_app/")
define build_image
$(call target_title, "Building $(1) Image") \
&& . ./devops/scripts/check_dependencies.sh \
&& . ./devops/scripts/load_env.sh ./devops/.env \
&& . ./devops/scripts/set_docker_sock_permission.sh \
&& source <(grep = $(2) | sed 's/ *= */=/g') \
&& az acr login -n $${ACR_NAME} \
&& if [ ! -z "$${CACHE_ACR_NAME}" ]; then az acr login -n $${CACHE_ACR_NAME}; \
	cache_source="--cache-from $${CACHE_ACR_NAME}.azurecr.io/$${image_name_suffix}:$${__version__}"; fi \
&& docker build -t ${FULL_IMAGE_NAME_PREFIX}/$(1):$${__version__} --build-arg BUILDKIT_INLINE_CACHE=1 \
	--cache-from ${FULL_IMAGE_NAME_PREFIX}/$(1):$${__version__} $${cache_source} -f $(3) $(4)
endef

build-api-image:
	$(call build_image,"api","api_app/_version.py","api_app/Dockerfile","api_app/")

build-resource-processor-vm-porter-image:
	$(call build_image,"resource-processor-vm-porter","resource_processor/version.txt","resource_processor/vmss_porter/Dockerfile","resource_processor/")

build-gitea-image:
	$(call build_image,"gitea","templates/shared_services/gitea/version.txt","templates/shared_services/gitea/Dockerfile","templates/shared_services/gitea/")

build-guacamole-image:
	$(call build_image,"guac-server","templates/workspace_services/guacamole/version.txt","templates/workspace_services/guacamole/guacamole-server/docker/Dockerfile","templates/workspace_services/guacamole/guacamole-server")

# A recipe for pushing images. Parameters:
# 1. Image name suffix
# 2. Version file path
# Example: $(call push_image,"api","./api_app/_version.py")
define push_image
$(call target_title, "Pushing $(1) Image") \
&& . ./devops/scripts/check_dependencies.sh \
&& . ./devops/scripts/load_env.sh ./devops/.env \
&& . ./devops/scripts/set_docker_sock_permission.sh \
&& source <(grep = $(2) | sed 's/ *= */=/g') \
&& az acr login -n $${ACR_NAME} \
&& docker push "${FULL_IMAGE_NAME_PREFIX}/$(1):$${__version__}"
endef

push-api-image:
	$(call push_image,"api","./api_app/_version.py")

push-resource-processor-vm-porter-image:
	$(call push_image,"resource-processor-vm-porter","./resource_processor/version.txt")

push-gitea-image:
	$(call push_image,"gitea","./templates/shared_services/gitea/version.txt")

push-guacamole-image:
	$(call push_image,"guac-server","./templates/workspace_services/guacamole/version.txt")

tre-deploy:
	$(call target_title, "Deploying TRE") \
	&& . ./devops/scripts/check_dependencies.sh nodocker \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& cd ./templates/core/terraform/ && ./deploy.sh

letsencrypt:
	$(call target_title, "Requesting LetsEncrypt SSL certificate") \
	&& . ./devops/scripts/check_dependencies.sh nodocker,certbot \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& pushd ./templates/core/terraform/ > /dev/null && . ./outputs.sh && popd > /dev/null \
	&& . ./devops/scripts/load_env.sh ./templates/core/tre.env \
	&& ./templates/core/terraform/scripts/letsencrypt.sh

tre-stop:
	$(call target_title, "Stopping TRE") \
	&& . ./devops/scripts/check_dependencies.sh azfirewall \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& ./devops/scripts/control_tre.sh stop

tre-start:
	$(call target_title, "Starting TRE") \
	&& . ./devops/scripts/check_dependencies.sh azfirewall \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& ./devops/scripts/control_tre.sh start

tre-destroy:
	$(call target_title, "Destroying TRE") \
	&& . ./devops/scripts/check_dependencies.sh nodocker \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& cd ./templates/core/terraform/ && ./destroy.sh

terraform-deploy:
	$(call target_title, "Deploying ${DIR} with Terraform") \
	&& . ./devops/scripts/check_dependencies.sh \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_terraform_env.sh ${DIR}/.env \
	&& cd ${DIR}/terraform/ && ./deploy.sh

terraform-import:
	$(call target_title, "Importing ${DIR} with Terraform") \
	&& . ./devops/scripts/check_dependencies.sh \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_terraform_env.sh ${DIR}/.env \
	&& cd ${DIR}/terraform/ && ./import.sh

terraform-destroy:
	$(call target_title, "Destroying ${DIR} Service") \
	&& . ./devops/scripts/check_dependencies.sh \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_terraform_env.sh ${DIR}/.env \
	&& cd ${DIR}/terraform/ && ./destroy.sh

terraform-format:
	$(call target_title, "Linting Terraform") \
	&& cd ./templates && terraform fmt -check -recursive -diff

porter-build:
	$(call target_title, "Building ${DIR} bundle") \
	&& . ./devops/scripts/check_dependencies.sh porter \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ${DIR}/.env \
	&& . ./devops/scripts/set_docker_sock_permission.sh \
	&& cd ${DIR} && porter build --debug

porter-install:
	$(call target_title, "Deploying ${DIR} with Porter") \
	&& . ./devops/scripts/check_dependencies.sh porter \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ${DIR}/.env \
	&& cd ${DIR} && porter install -p ./parameters.json --cred ./azure.json --allow-docker-host-access --debug

porter-uninstall:
	$(call target_title, "Uninstalling ${DIR} with Porter") \
	&& ./devops/scripts/check_dependencies.sh porter \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ${DIR}/.env \
	&& cd ${DIR} && porter uninstall -p ./parameters.json --cred ./azure.json --debug

porter-custom-action:
	$(call target_title, "Performing:${ACTION} ${DIR} with Porter") \
	&& . ./devops/scripts/check_dependencies.sh porter \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ${DIR}/.env \
	&& cd ${DIR} && porter invoke --action ${ACTION} -p ./parameters.json --cred ./azure.json --debug

porter-publish:
	$(call target_title, "Publishing ${DIR} bundle") \
	&& ./devops/scripts/check_dependencies.sh porter \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& az acr login --name $${ACR_NAME}	\
	&& cd ${DIR} \
	&& porter publish --registry "$${ACR_NAME}.azurecr.io" --debug

register-bundle:
	$(call target_title, "Registering ${DIR} bundle with API") \
	&& ./devops/scripts/check_dependencies.sh porter \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& az acr login --name $${ACR_NAME}	\
	&& cd ${DIR} \
	&& ${ROOTPATH}/devops/scripts/register_bundle_with_api.sh --acr-name $${ACR_NAME} --bundle-type $${BUNDLE_TYPE} --current --insecure --tre_url $${TRE_URL} --verify

static-web-upload:
	$(call target_title, "Uploading to static website") \
	&& . ./devops/scripts/check_dependencies.sh nodocker \
	&& . ./devops/scripts/load_env.sh ./templates/core/.env \
	&& . ./devops/scripts/load_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./devops/.env \
	&& . ./devops/scripts/load_terraform_env.sh ./templates/core/.env \
	&& pushd ./templates/core/terraform/ > /dev/null && . ./outputs.sh && popd > /dev/null \
	&& . ./devops/scripts/load_env.sh ./templates/core/tre.env \
	&& ./templates/core/terraform/scripts/upload_static_web.sh

test-e2e:
	$(call target_title, "Running E2E smoke tests") && \
	export SCOPE="api://${RESOURCE}/user_impersonation" && \
	export WORKSPACE_SCOPE="api://${TEST_WORKSPACE_APP_ID}/user_impersonation" && \
	cd e2e_tests && \
	python -m pytest -m smoke --verify $${IS_API_SECURED:-true} --junit-xml pytest_e2e.xml
