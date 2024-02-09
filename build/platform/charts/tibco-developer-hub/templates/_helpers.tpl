{{/*
Copyright © 2023. Cloud Software Group, Inc.
This file is subject to the license terms contained
in the license file that is distributed with this file.
*/}}

{{/*
Return the proper image name
*/}}

{{- define "backstage.image" -}}
{{- $CPImageValues := dict "registry" "reldocker.tibco.com" -}}
    {{- if .Values.global.cp -}}
    {{- $CPImageValues = dict "registry" (.Values.global.cp.containerRegistry.url | default "reldocker.tibco.com") -}}
    {{- $imageRoot := merge .Values.backstage.image $CPImageValues -}}
        {{ if (hasSuffix ".jfrog.io" $imageRoot.registry) }}
        {{- $imageRoot = merge (dict "repository" .Values.backstage.image.jfrogRepository) $imageRoot -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot  "global" .Values.global) }}
        {{- else -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot "global" .Values.global) }}
        {{- end -}}
    {{- end -}}
{{- end -}}

{{- define "fluentbit.image" -}}
{{- $CPImageValues := dict "registry" "reldocker.tibco.com" -}}
    {{- if .Values.global.cp -}}
    {{- $CPImageValues = dict "registry" (.Values.global.cp.containerRegistry.url | default "reldocker.tibco.com") -}}
    {{- $imageRoot := merge .Values.fluentbit.image $CPImageValues -}}
        {{ if (hasSuffix ".jfrog.io" $imageRoot.registry) }}
        {{- $imageRoot = merge (dict "repository" .Values.fluentbit.image.jfrogRepository) $imageRoot -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot  "global" .Values.global) }}
        {{- else -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot "global" .Values.global) }}
        {{- end -}}
    {{- end -}}
{{- end -}}

{{- define "postgresql.image" -}}
{{- $CPImageValues := dict "registry" "reldocker.tibco.com" -}}
    {{- if .Values.global.cp -}}
    {{- $CPImageValues = dict "registry" (.Values.global.cp.containerRegistry.url | default "reldocker.tibco.com") -}}
    {{- $imageRoot := merge .Values.image $CPImageValues -}}
        {{ if (hasSuffix ".jfrog.io" $imageRoot.registry) }}
        {{- $imageRoot = merge (dict "repository" .Values.image.jfrogRepository) $imageRoot -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot  "global" .Values.global) }}
        {{- else -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot "global" .Values.global) }}
        {{- end -}}
    {{- end -}}
{{- end -}}

{{- define "postgresql.initContainer.image" -}}
{{- $CPImageValues := dict "registry" "reldocker.tibco.com" -}}
    {{- if .Values.global.cp -}}
    {{- $CPImageValues = dict "registry" (.Values.global.cp.containerRegistry.url | default "reldocker.tibco.com") -}}
    {{- $imageRoot := merge .Values.initContainer.image $CPImageValues -}}
        {{ if (hasSuffix ".jfrog.io" $imageRoot.registry) }}
        {{- $imageRoot = merge (dict "repository" .Values.initContainer.image.jfrogRepository) $imageRoot -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot  "global" .Values.global) }}
        {{- else -}}
        {{ include "common.images.image" (dict "imageRoot" $imageRoot "global" .Values.global) }}
        {{- end -}}
    {{- end -}}
{{- end -}}

{{/*
 Create the name of the service account to use
 */}}
{{- define "backstage.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "common.names.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{- if .Values.global.cp -}}
    {{ default "default" .Values.global.cp.resources.serviceaccount.serviceAccountName }}
    {{- else -}}
    {{ default "default" .Values.serviceAccount.name  }}
    {{- end -}} 
{{- end -}}
{{- end -}}
# here we are overridding the helper function used in postgresql charts to set the serviceaccount.name based on user provided value from CP.
{{- define "postgresql.serviceAccountName" -}}
{{- if (.Values.serviceAccount.create) -}}
    {{ default (include "common.names.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{- if .Values.global.cp -}}
    {{ default "default" .Values.global.cp.resources.serviceaccount.serviceAccountName  }}
    {{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
    {{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "backstage.postgresql.fullname" -}}
{{- include "common.names.dependency.fullname" (dict "chartName" "postgresql" "chartValues" .Values.postgresql "context" $) -}}
{{- end -}}

{{/*
Return the Postgres Database hostname
*/}}
{{- define "backstage.postgresql.host" -}}
{{- if eq .Values.postgresql.architecture "replication" }}
{{- include "backstage.postgresql.fullname" . -}}-primary
{{- else -}}
{{- include "backstage.postgresql.fullname" . -}}
{{- end -}}
{{- end -}}

{{/*
Return the Postgres Database Secret Name
*/}}
{{- define "backstage.postgresql.databaseSecretName" -}}
{{- if .Values.postgresql.auth.existingSecret }}
    {{- tpl .Values.postgresql.auth.existingSecret $ -}}
{{- else -}}
    {{- default (include "backstage.postgresql.fullname" .) (tpl .Values.postgresql.auth.existingSecret $) -}}
{{- end -}}
{{- end -}}

{{/*
Return the Postgres databaseSecret key to retrieve credentials for database
*/}}
{{- define "backstage.postgresql.databaseSecretKey" -}}
{{- if .Values.postgresql.auth.existingSecret -}}
    {{- .Values.postgresql.auth.secretKeys.userPasswordKey  -}}
{{- else -}}
    {{- print "password" -}}
{{- end -}}
{{- end -}}

{{- define "tibcohub.platform.commonLabels" -}}
{{- if ((.Values.global.cp).dataplaneId) }}platform.tibco.com/dataplane-id: {{ .Values.global.cp.dataplaneId | quote }}{{- end }}
{{- if ((.Values.global.cp).instanceId) }}
platform.tibco.com/capability-instance-id: {{ .Values.global.cp.instanceId | quote }}
{{- end }}
platform.tibco.com/workload-type: capability-service
{{- end -}}

{{/*
Form a URL using Control Plane hostname
*/}}
{{- define "tibcohub.cp.url" -}}
{{- $ctx := .context | default . -}}
{{- if ($ctx.Values.global.cp).cpHostname }}
{{- $url := $ctx.Values.global.cp.cpHostname | trimSuffix "/" -}}
{{- if not (regexMatch "^http[s]://" $url) -}}
    {{- $url = print "https://" $url -}}
{{- end -}}
{{- if .path -}}
    {{- $url = print $url "/" (.path | trimPrefix "/") -}}
{{- end -}}
{{- print $url -}}
{{- end }}
{{- end -}}

Form a URL using TIBCO HUB hostname
*/}}
{{- define "tibcohub.host.url" -}}
{{- $ctx := .context | default . -}}
{{- if ($ctx.Values.ingress).host }}
{{- $url := $ctx.Values.ingress.host | trimSuffix "/" -}}
{{- if not (regexMatch "^http[s]://" $url) -}}
    {{- $url = print "https://" $url -}}
{{- end -}}
{{- if .path -}}
    {{- $url = print $url "/" (.path | trimPrefix "/") -}}
{{- end -}}
{{- print $url -}}
{{- end }}
{{- end -}}

{{- define "tibcohub.ingress.annotations" -}}
nginx.ingress.kubernetes.io/auth-response-headers: >-
    X-Auth-Request-User,X-Auth-Request-Email,X-Forwarded-Access-Token,X-Auth-Request-Access-Token,X-Atmosphere-Token
nginx.ingress.kubernetes.io/auth-signin: {{ include "tibcohub.host.url" (dict "path" "tibco/hub/oauth2/start?rd=$escaped_request_uri" "context" $) }}
nginx.ingress.kubernetes.io/auth-url: {{ include "tibcohub.host.url" (dict "path" "tibco/hub/oauth2/auth" "context" $) }}
nginx.ingress.kubernetes.io/proxy-buffer-size: 16k  
{{- end -}}

{{- define "postgresql.imagePullSecrets" -}}
{{- if .Values.global.cp.containerRegistry.secret -}}
imagePullSecrets:
  - name: {{ .Values.global.cp.containerRegistry.secret }}
{{- end -}}
{{- end -}}