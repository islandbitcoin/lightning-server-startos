# Preserve the application from the signed Atoll release, including its StartOS
# TLS and persistence changes. Only the package wrapper changes in this revision.
FROM --platform=$BUILDPLATFORM alpine:3.23@sha256:469c9ea410b9215eaee7976ba6c0639039b444be8e5d638f7abbada189971eb2 AS extract
RUN apk add --no-cache squashfs-tools
ARG TARGETARCH
COPY image/inputs/${TARGETARCH}.squashfs /image.squashfs
RUN unsquashfs -no-progress -d /rootfs /image.squashfs

FROM lightninglabs/lnd:v0.21.8-beta@sha256:f17b2944b1b76396cccbe58feac469b6cefb5f407557ac77f0880f136fb935f9 AS lndcli

FROM scratch
COPY --from=extract /rootfs/ /
COPY --from=lndcli /bin/lncli /usr/local/bin/lncli
COPY image/managed-lnd.cjs /app/managed-lnd.cjs
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    NODE_VERSION=20.20.2 YARN_VERSION=1.22.22 \
    NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
USER root
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "/app/managed-lnd.cjs", "start"]
