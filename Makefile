ARCHES := x86 arm
include s9pk.mk

.PHONY: normalize-package-permissions

$(BASE_NAME).s9pk $(BASE_NAME)_%.s9pk: normalize-package-permissions
ingredients: normalize-package-permissions

normalize-package-permissions: javascript/index.js
	chmod -R a+rX javascript assets
	chmod a+r icon.svg instructions.md LICENSE

# GNU make's stamp serializes preparation for multi-architecture builds.
image/inputs/.prepared: image/prepare.sh
	sh image/prepare.sh
	touch $@

$(BASE_NAME).s9pk $(BASE_NAME)_%.s9pk: image/managed-lnd.cjs image/prepare.sh Dockerfile
ingredients: image/inputs/.prepared
