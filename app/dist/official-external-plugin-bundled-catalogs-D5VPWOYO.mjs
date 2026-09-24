import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as official_external_provider_catalog_default } from "./official-external-provider-catalog-BDknP_LE.mjs";
//#endregion
//#region src/plugins/official-external-plugin-bundled-catalogs.ts
const BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES = [
	{ entries: [
		{
			"name": "@testclaw/buzz",
			"version": "2026.9.5",
			"description": "Connect Assistant agents to Buzz rooms",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channelConfigs": { "buzz": {
					"label": "Buzz",
					"description": "Connect Assistant agents to Buzz team rooms."
				} },
				"channel": {
					"id": "buzz",
					"configuredState": { "env": { "allOf": ["BUZZ_RELAY_URL", "BUZZ_PRIVATE_KEY"] } },
					"label": "Buzz",
					"selectionLabel": "Buzz",
					"docsPath": "/channels/buzz",
					"docsLabel": "buzz",
					"blurb": "Connect Assistant agents to Buzz team rooms.",
					"markdownCapable": true,
					"order": 56,
					"setup": { "fields": [
						{
							"key": "relayUrl",
							"kind": "string",
							"cli": {
								"flags": "--relay-url <url>",
								"description": "Buzz relay WebSocket URL"
							}
						},
						{
							"key": "privateKey",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--private-key <key>",
								"description": "Buzz bot Nostr private key"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use BUZZ_PRIVATE_KEY with the supplied relay URL"
							},
							"envVars": ["BUZZ_PRIVATE_KEY"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/buzz",
					"npmSpec": "@testclaw/buzz",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@testclaw/clickclack",
			"version": "2026.9.5",
			"description": "Assistant ClickClack channel plugin",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"contracts": { "tools": ["discussion"] },
				"channelConfigs": { "clickclack": {
					"label": "ClickClack",
					"description": "ClickClack channel accounts and group activation policy."
				} },
				"channel": {
					"id": "clickclack",
					"configuredState": { "env": { "anyOf": ["CLICKCLACK_BOT_TOKEN"] } },
					"label": "ClickClack",
					"selectionLabel": "ClickClack",
					"detailLabel": "ClickClack Bot",
					"docsPath": "/channels/clickclack",
					"docsLabel": "clickclack",
					"blurb": "self-hosted chat via first-class ClickClack bot tokens.",
					"systemImage": "bubble.left.and.bubble.right",
					"markdownCapable": true,
					"preferSessionLookupForAnnounceTarget": true,
					"order": 85,
					"commands": {
						"nativeCommandsAutoEnabled": false,
						"nativeSkillsAutoEnabled": false
					},
					"setup": { "fields": [
						{
							"key": "code",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--code <code>",
								"description": "ClickClack one-time setup code or setup URL"
							}
						},
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "ClickClack bot token"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "ClickClack bot token file"
							}
						},
						{
							"key": "baseUrl",
							"kind": "string",
							"cli": {
								"flags": "--base-url <url>",
								"description": "ClickClack API base URL"
							}
						},
						{
							"key": "workspace",
							"kind": "string",
							"cli": {
								"flags": "--workspace <workspace>",
								"description": "ClickClack workspace id, slug, or name"
							}
						},
						{
							"key": "defaultTo",
							"kind": "string",
							"cli": {
								"flags": "--default-to <target>",
								"description": "Default ClickClack target"
							}
						},
						{
							"key": "allowFrom",
							"kind": "string-list",
							"cli": {
								"flags": "--allow-from <ids>",
								"description": "Allowed ClickClack senders"
							}
						},
						{
							"key": "agentActivity",
							"kind": "boolean",
							"cli": {
								"flags": "--agent-activity",
								"description": "Enable ClickClack agent activity"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use CLICKCLACK_BOT_TOKEN"
							},
							"envVars": ["CLICKCLACK_BOT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/clickclack",
					"npmSpec": "@testclaw/clickclack",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/discord",
			"version": "2026.9.5",
			"description": "Assistant Discord channel plugin for channels, DMs, commands, and app events.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"contracts": { "transcriptSourceProviders": ["discord-voice"] },
				"channel": {
					"id": "discord",
					"configuredState": { "env": { "anyOf": ["DISCORD_BOT_TOKEN"] } },
					"approvalFlags": ["native"],
					"label": "Discord",
					"selectionLabel": "Discord (Bot API)",
					"detailLabel": "Discord Bot",
					"docsPath": "/channels/discord",
					"docsLabel": "discord",
					"blurb": "very well supported right now.",
					"systemImage": "bubble.left.and.bubble.right",
					"markdownCapable": true,
					"preferSessionLookupForAnnounceTarget": true,
					"setup": { "fields": [{
						"key": "token",
						"kind": "string",
						"sensitive": true,
						"cli": {
							"flags": "--token <token>",
							"description": "Discord bot token"
						}
					}, {
						"key": "useEnv",
						"kind": "boolean",
						"cli": {
							"flags": "--use-env",
							"description": "Use DISCORD_BOT_TOKEN"
						},
						"envVars": ["DISCORD_BOT_TOKEN"]
					}] },
					"commands": {
						"nativeCommandsAutoEnabled": true,
						"nativeSkillsAutoEnabled": true
					},
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "route",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					}
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/discord",
					"npmSpec": "@testclaw/discord",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.26",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/feishu",
			"version": "2026.9.5",
			"description": "Assistant Feishu/Lark channel plugin for chats and workplace tools (community maintained by @m1heng).",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"contracts": { "tools": [
					"feishu_app_scopes",
					"feishu_bitable_create_app",
					"feishu_bitable_create_field",
					"feishu_bitable_create_record",
					"feishu_bitable_get_meta",
					"feishu_bitable_get_record",
					"feishu_bitable_list_fields",
					"feishu_bitable_list_records",
					"feishu_bitable_update_record",
					"feishu_chat",
					"feishu_doc",
					"feishu_drive",
					"feishu_perm",
					"feishu_wiki"
				] },
				"channel": {
					"id": "feishu",
					"configuredState": {
						"env": { "anyOf": [
							"FEISHU_APP_ID",
							"FEISHU_APP_SECRET",
							"FEISHU_VERIFICATION_TOKEN",
							"FEISHU_ENCRYPT_KEY"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredFeishuChannelState"
					},
					"label": "Feishu",
					"selectionLabel": "Feishu/Lark (飞书)",
					"docsPath": "/channels/feishu",
					"docsLabel": "feishu",
					"blurb": "飞书/Lark enterprise messaging with doc/wiki/drive tools.",
					"aliases": ["lark"],
					"order": 35,
					"quickstartAllowFrom": true,
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/feishu",
					"npmSpec": "@testclaw/feishu",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.29"
				}
			}
		},
		{
			"name": "@testclaw/googlechat",
			"version": "2026.9.5",
			"description": "Assistant Google Chat channel plugin for spaces and direct messages.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "googlechat",
					"configuredState": { "env": { "anyOf": ["GOOGLE_CHAT_SERVICE_ACCOUNT", "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE"] } },
					"approvalFlags": ["native"],
					"label": "Google Chat",
					"selectionLabel": "Google Chat (Chat API)",
					"detailLabel": "Google Chat",
					"docsPath": "/channels/googlechat",
					"docsLabel": "googlechat",
					"blurb": "Google Workspace Chat app with HTTP webhook.",
					"aliases": ["gchat", "google-chat"],
					"order": 55,
					"systemImage": "message.badge",
					"markdownCapable": true,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "route",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					},
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <json>",
								"description": "Google Chat service account JSON"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "Google Chat service account file"
							}
						},
						{
							"key": "audienceType",
							"kind": "choice",
							"choices": ["app-url", "project-number"],
							"cli": {
								"flags": "--audience-type <type>",
								"description": "Google Chat audience type"
							}
						},
						{
							"key": "audience",
							"kind": "string",
							"cli": {
								"flags": "--audience <value>",
								"description": "Google Chat audience value"
							}
						},
						{
							"key": "webhookPath",
							"kind": "string",
							"cli": {
								"flags": "--webhook-path <path>",
								"description": "Google Chat webhook path"
							}
						},
						{
							"key": "webhookUrl",
							"kind": "string",
							"cli": {
								"flags": "--webhook-url <url>",
								"description": "Google Chat webhook URL"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Google Chat environment credentials"
							},
							"envVars": ["GOOGLE_CHAT_SERVICE_ACCOUNT", "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE"],
							"envVarMode": "any"
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/googlechat",
					"npmSpec": "@testclaw/googlechat",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/imessage",
			"version": "2026.9.5",
			"description": "Assistant iMessage channel plugin using imsg on a signed-in Mac",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "imessage",
					"approvalFlags": ["native"],
					"label": "iMessage",
					"selectionLabel": "iMessage (imsg)",
					"detailLabel": "iMessage",
					"docsPath": "/channels/imessage",
					"docsLabel": "imessage",
					"blurb": "Local iMessage/SMS through the imsg bridge, including private API message actions when enabled.",
					"aliases": ["imsg"],
					"systemImage": "message.fill",
					"setup": { "fields": [
						{
							"key": "cliPath",
							"kind": "string",
							"cli": {
								"flags": "--cli-path <path>",
								"description": "iMessage CLI path"
							}
						},
						{
							"key": "dbPath",
							"kind": "string",
							"cli": {
								"flags": "--db-path <path>",
								"description": "iMessage database path"
							}
						},
						{
							"key": "service",
							"kind": "choice",
							"choices": [
								"imessage",
								"sms",
								"auto"
							],
							"cli": {
								"flags": "--service <service>",
								"description": "iMessage service"
							}
						},
						{
							"key": "region",
							"kind": "string",
							"cli": {
								"flags": "--region <region>",
								"description": "SMS region"
							}
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/imessage",
					"npmSpec": "@testclaw/imessage",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/irc",
			"version": "2026.9.5",
			"description": "Assistant IRC channel plugin",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "irc",
					"configuredState": { "env": { "allOf": ["IRC_HOST", "IRC_NICK"] } },
					"label": "IRC",
					"selectionLabel": "IRC (Server + Nick)",
					"detailLabel": "IRC",
					"docsPath": "/channels/irc",
					"docsLabel": "irc",
					"blurb": "classic IRC networks with DM/channel routing and pairing controls.",
					"aliases": ["internet-relay-chat"],
					"systemImage": "network",
					"setup": { "fields": [
						{
							"key": "host",
							"kind": "string",
							"cli": {
								"flags": "--host <host>",
								"description": "IRC server host"
							}
						},
						{
							"key": "port",
							"kind": "string",
							"cli": {
								"flags": "--port <port>",
								"description": "IRC server port"
							}
						},
						{
							"key": "tls",
							"kind": "boolean",
							"cli": {
								"flags": "--tls",
								"description": "Use TLS for IRC"
							}
						},
						{
							"key": "nick",
							"kind": "string",
							"cli": {
								"flags": "--nick <nick>",
								"description": "IRC nickname"
							}
						},
						{
							"key": "username",
							"kind": "string",
							"cli": {
								"flags": "--username <name>",
								"description": "IRC username"
							}
						},
						{
							"key": "realname",
							"kind": "string",
							"cli": {
								"flags": "--realname <name>",
								"description": "IRC real name"
							}
						},
						{
							"key": "channels",
							"kind": "string-list",
							"cli": {
								"flags": "--channels <names>",
								"description": "IRC channels"
							}
						},
						{
							"key": "password",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--password <password>",
								"description": "IRC server password"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use IRC environment configuration"
							},
							"envVars": ["IRC_HOST", "IRC_NICK"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/irc",
					"npmSpec": "@testclaw/irc",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/line",
			"version": "2026.9.5",
			"description": "Assistant LINE channel plugin for LINE Bot API chats.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "line",
					"configuredState": { "env": { "allOf": ["LINE_CHANNEL_ACCESS_TOKEN", "LINE_CHANNEL_SECRET"] } },
					"label": "LINE",
					"selectionLabel": "LINE (Messaging API)",
					"detailLabel": "LINE Bot",
					"docsPath": "/channels/line",
					"docsLabel": "line",
					"blurb": "LINE Messaging API webhook bot.",
					"systemImage": "message",
					"order": 75,
					"quickstartAllowFrom": true,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "sender",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": true
					},
					"setup": { "fields": [
						{
							"key": "channelAccessToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--channel-access-token <token>",
								"description": "LINE channel access token"
							}
						},
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "LINE channel access token (alias)"
							}
						},
						{
							"key": "channelSecret",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--channel-secret <secret>",
								"description": "LINE channel secret"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "LINE access token file"
							}
						},
						{
							"key": "secretFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--secret-file <path>",
								"description": "LINE channel secret file"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use LINE environment credentials"
							},
							"envVars": ["LINE_CHANNEL_ACCESS_TOKEN", "LINE_CHANNEL_SECRET"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/line",
					"npmSpec": "@testclaw/line",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/matrix",
			"version": "2026.9.5",
			"description": "Assistant Matrix channel plugin for rooms and direct messages.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "matrix",
					"configuredState": { "env": { "anyOf": [
						"MATRIX_HOMESERVER",
						"MATRIX_USER_ID",
						"MATRIX_ACCESS_TOKEN",
						"MATRIX_PASSWORD",
						"MATRIX_DEVICE_ID",
						"MATRIX_DEVICE_NAME",
						"MATRIX_OPS_HOMESERVER",
						"MATRIX_OPS_ACCESS_TOKEN",
						"MATRIX_OPS_DEVICE_ID",
						"MATRIX_OPS_DEVICE_NAME"
					] } },
					"approvalFlags": ["native"],
					"label": "Matrix",
					"selectionLabel": "Matrix (plugin)",
					"docsPath": "/channels/matrix",
					"docsLabel": "matrix",
					"blurb": "open protocol; install the plugin to enable.",
					"order": 70,
					"markdownCapable": true,
					"quickstartAllowFrom": true,
					"doctorCapabilities": {
						"dmAllowFromMode": "nestedOnly",
						"groupModel": "sender",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": true
					},
					"setup": { "fields": [
						{
							"key": "homeserver",
							"kind": "string",
							"cli": {
								"flags": "--homeserver <url>",
								"description": "Matrix homeserver URL"
							}
						},
						{
							"key": "userId",
							"kind": "string",
							"cli": {
								"flags": "--user-id <id>",
								"description": "Matrix user id"
							}
						},
						{
							"key": "accessToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--access-token <token>",
								"description": "Matrix access token"
							}
						},
						{
							"key": "password",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--password <password>",
								"description": "Matrix password"
							}
						},
						{
							"key": "deviceName",
							"kind": "string",
							"cli": {
								"flags": "--device-name <name>",
								"description": "Matrix device name"
							}
						},
						{
							"key": "avatarUrl",
							"kind": "string",
							"cli": {
								"flags": "--avatar-url <url>",
								"description": "Matrix avatar URL"
							}
						},
						{
							"key": "initialSyncLimit",
							"kind": "integer",
							"cli": {
								"flags": "--initial-sync-limit <n>",
								"description": "Matrix initial sync room limit"
							}
						},
						{
							"key": "proxy",
							"kind": "string",
							"cli": {
								"flags": "--proxy <url>",
								"description": "Matrix proxy URL"
							}
						},
						{
							"key": "dangerouslyAllowPrivateNetwork",
							"kind": "boolean",
							"cli": {
								"flags": "--dangerously-allow-private-network",
								"description": "Allow private-network Matrix homeservers"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Matrix environment credentials"
							}
						}
					] },
					"persistedAuthState": {
						"specifier": "./auth-presence",
						"exportName": "hasAnyMatrixAuth",
						"backingStore": "plugin-state"
					}
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/matrix",
					"npmSpec": "@testclaw/matrix",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/mattermost",
			"version": "2026.9.5",
			"description": "Assistant Mattermost channel plugin",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "mattermost",
					"configuredState": { "env": { "allOf": ["MATTERMOST_BOT_TOKEN", "MATTERMOST_URL"] } },
					"label": "Mattermost",
					"selectionLabel": "Mattermost (plugin)",
					"docsPath": "/channels/mattermost",
					"docsLabel": "mattermost",
					"blurb": "self-hosted Slack-style chat; install the plugin to enable.",
					"order": 65,
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "Mattermost bot token"
							}
						},
						{
							"key": "botToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--bot-token <token>",
								"description": "Mattermost bot token"
							}
						},
						{
							"key": "httpUrl",
							"kind": "string",
							"cli": {
								"flags": "--http-url <url>",
								"description": "Mattermost server URL"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Mattermost environment credentials"
							},
							"envVars": ["MATTERMOST_BOT_TOKEN", "MATTERMOST_URL"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/mattermost",
					"npmSpec": "@testclaw/mattermost",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/msteams",
			"version": "2026.9.5",
			"description": "Assistant Microsoft Teams channel plugin for bot conversations.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "msteams",
					"configuredState": {
						"env": { "anyOf": [
							"MSTEAMS_APP_ID",
							"MSTEAMS_APP_PASSWORD",
							"MSTEAMS_TENANT_ID"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredMSTeamsChannelState"
					},
					"label": "Microsoft Teams",
					"selectionLabel": "Microsoft Teams (Teams SDK)",
					"docsPath": "/channels/msteams",
					"docsLabel": "msteams",
					"blurb": "Teams SDK; enterprise support.",
					"aliases": ["teams"],
					"order": 60,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "hybrid",
						"groupAllowFromFallbackToAllowFrom": true,
						"warnOnEmptyGroupSenderAllowlist": true
					},
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/msteams",
					"npmSpec": "@testclaw/msteams",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/nextcloud-talk",
			"version": "2026.9.5",
			"description": "Assistant Nextcloud Talk channel plugin for conversations.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "nextcloud-talk",
					"configuredState": {
						"env": { "anyOf": ["NEXTCLOUD_TALK_BOT_SECRET", "NEXTCLOUD_TALK_API_PASSWORD"] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredNextcloudTalkChannelState"
					},
					"label": "Nextcloud Talk",
					"selectionLabel": "Nextcloud Talk (self-hosted)",
					"docsPath": "/channels/nextcloud-talk",
					"docsLabel": "nextcloud-talk",
					"blurb": "Self-hosted chat via Nextcloud Talk webhook bots.",
					"aliases": ["nc-talk", "nc"],
					"order": 65,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "baseUrl",
							"kind": "string",
							"cli": {
								"flags": "--base-url <url>",
								"description": "Nextcloud base URL"
							}
						},
						{
							"key": "url",
							"kind": "string",
							"cli": {
								"flags": "--url <url>",
								"description": "Legacy Nextcloud base URL alias"
							}
						},
						{
							"key": "secret",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--secret <secret>",
								"description": "Nextcloud Talk bot secret"
							}
						},
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <secret>",
								"description": "Legacy Nextcloud bot secret alias"
							}
						},
						{
							"key": "password",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--password <secret>",
								"description": "Legacy Nextcloud bot secret alias"
							}
						},
						{
							"key": "secretFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--secret-file <path>",
								"description": "Nextcloud Talk bot secret file"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "Legacy Nextcloud bot secret file alias"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Nextcloud Talk environment credentials"
							},
							"envVars": ["NEXTCLOUD_TALK_BOT_SECRET"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/nextcloud-talk",
					"npmSpec": "@testclaw/nextcloud-talk",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/nostr",
			"version": "2026.9.5",
			"description": "Assistant Nostr channel plugin for NIP-04 encrypted direct messages.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "nostr",
					"configuredState": { "env": { "anyOf": ["NOSTR_PRIVATE_KEY"] } },
					"label": "Nostr",
					"selectionLabel": "Nostr (NIP-04 DMs)",
					"docsPath": "/channels/nostr",
					"docsLabel": "nostr",
					"blurb": "Decentralized protocol; encrypted DMs via NIP-04.",
					"order": 55,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "privateKey",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--private-key <key>",
								"description": "Nostr private key"
							}
						},
						{
							"key": "relayUrls",
							"kind": "string",
							"cli": {
								"flags": "--relay-urls <urls>",
								"description": "Nostr relay URLs"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use NOSTR_PRIVATE_KEY"
							},
							"envVars": ["NOSTR_PRIVATE_KEY"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/nostr",
					"npmSpec": "@testclaw/nostr",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@tencent-weixin/testclaw-weixin",
			"description": "Assistant Weixin channel plugin by the Tencent Weixin team.",
			"source": "external",
			"kind": "channel",
			"testclaw": {
				"plugin": {
					"id": "testclaw-weixin",
					"label": "Weixin"
				},
				"channel": {
					"id": "testclaw-weixin",
					"label": "Weixin",
					"selectionLabel": "Weixin（微信）",
					"detailLabel": "Weixin",
					"docsPath": "/channels/wechat",
					"docsLabel": "weixin",
					"blurb": "Personal WeChat messaging via QR-code login.",
					"aliases": [
						"weixin",
						"wechat",
						"微信"
					],
					"order": 75
				},
				"channelConfigs": { "testclaw-weixin": {
					"label": "Weixin",
					"description": "Personal WeChat conversation channel.",
					"schema": {
						"type": "object",
						"additionalProperties": true
					}
				} },
				"install": {
					"npmSpec": "@tencent-weixin/testclaw-weixin@2.4.8",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-hhO9prUQwzfSpIL6XGWazRsxNs89K+Mis3iQW6a8eum4AIDxOUiTFMg4nlNVD/au0SjAx5CcJjo3KYWZqGpgQA==",
					"minHostVersion": ">=2026.5.12"
				}
			}
		},
		{
			"name": "@zalo-platforms/testclaw-zaloclawbot",
			"description": "Assistant Zalo ClawBot channel plugin by the Zalo Platforms team.",
			"source": "external",
			"kind": "channel",
			"testclaw": {
				"plugin": {
					"id": "testclaw-zaloclawbot",
					"label": "Zalo ClawBot"
				},
				"channel": {
					"id": "testclaw-zaloclawbot",
					"label": "Zalo ClawBot",
					"selectionLabel": "Zalo ClawBot (QR)",
					"detailLabel": "Zalo ClawBot",
					"docsPath": "/channels/zaloclawbot",
					"docsLabel": "zaloclawbot",
					"blurb": "Personal Zalo assistant bot via QR-code login — owner-bound, no setup.",
					"aliases": ["zaloclawbot", "zalo-clawbot"],
					"order": 82
				},
				"channelConfigs": { "testclaw-zaloclawbot": {
					"label": "Zalo ClawBot",
					"description": "Personal Zalo assistant — QR-onboarded, owner-bound.",
					"schema": {
						"type": "object",
						"additionalProperties": true
					}
				} },
				"install": {
					"npmSpec": "@zalo-platforms/testclaw-zaloclawbot@0.1.4",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-5IxZriHJYACLLGqkCPPsTP9tas62kXEOFqTFAFMdunAM3SPhIJwVFRp0WvoP/m7L2PX85weD0g8LOtxM93VDYg==",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@tencent-connect/testclaw-qqbot",
			"description": "Assistant QQ Bot channel plugin by the Tencent Connect team.",
			"source": "external",
			"kind": "channel",
			"testclaw": {
				"plugin": {
					"id": "testclaw-qqbot",
					"label": "QQ Bot"
				},
				"setupFeatures": { "configPromotion": "preserve-root" },
				"legacyNpmPackageNames": ["@testclaw/qqbot"],
				"contracts": { "tools": ["qqbot_platform_api", "qqbot_remind"] },
				"channel": {
					"id": "qqbot",
					"label": "QQ Bot",
					"selectionLabel": "QQ Bot (Official API)",
					"detailLabel": "QQ Bot",
					"docsPath": "/channels/qqbot",
					"docsLabel": "qqbot",
					"blurb": "connect to QQ via official QQ Bot API with group chat and direct message support.",
					"envVars": ["QQBOT_APP_ID", "QQBOT_CLIENT_SECRET"],
					"approvalFlags": ["native"],
					"doctorCapabilities": { "openDmRequiresAllowFromWildcard": false },
					"systemImage": "bubble.left.and.bubble.right"
				},
				"channelSecrets": { "fields": [{
					"field": "clientSecret",
					"activationField": "appId",
					"activationEnv": "QQBOT_APP_ID"
				}] },
				"channelHostConfig": {
					"docsSource": "official",
					"compatibilityMigration": "qqbot.tencent-2.0-compatibility",
					"schemaAllOf": [{
						"not": { "required": ["defaultAccount"] },
						"properties": {
							"allowFrom": {
								"type": "array",
								"minItems": 1,
								"items": { "allOf": [{ "not": { "const": "*" } }, { "anyOf": [{ "const": "approval-disabled" }, {
									"type": "string",
									"pattern": "^[^a-z]*$"
								}] }] }
							},
							"accounts": {
								"type": "object",
								"not": { "required": ["default"] },
								"additionalProperties": {
									"type": "object",
									"properties": { "allowFrom": {
										"type": "array",
										"minItems": 1,
										"items": { "allOf": [{ "not": { "const": "*" } }, { "anyOf": [{ "const": "approval-disabled" }, {
											"type": "string",
											"pattern": "^[^a-z]*$"
										}] }] }
									} },
									"required": ["allowFrom"]
								}
							}
						},
						"required": ["allowFrom"]
					}]
				},
				"channelConfigs": { "qqbot": {
					"label": "QQ Bot",
					"description": "QQ Bot API conversation channel.",
					"preferOver": ["qqbot"],
					"schema": {
						"type": "object",
						"additionalProperties": true,
						"properties": {
							"appId": { "type": "string" },
							"clientSecret": { "type": "string" }
						}
					}
				} },
				"install": {
					"npmSpec": "@tencent-connect/testclaw-qqbot@2.0.3",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-yngu/2cPeZjJfIfHWCXWB2/6KlDHrb9vpOUjKLdQxePLSp6wCn3CFOALcBIVq/9o6jlYz9WTU9idW6nfX1xpFA=="
				}
			}
		},
		{
			"name": "@testclaw/raft",
			"version": "2026.9.5",
			"description": "Assistant Raft channel plugin for Raft CLI wake bridges.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channelConfigs": { "raft": {
					"label": "Raft",
					"description": "Raft External Agent CLI wake bridge."
				} },
				"channel": {
					"id": "raft",
					"configuredState": { "env": { "anyOf": ["RAFT_PROFILE"] } },
					"label": "Raft",
					"selectionLabel": "Raft (CLI wake bridge)",
					"docsPath": "/channels/raft",
					"docsLabel": "raft",
					"blurb": "Raft CLI wake bridge for human and agent collaboration.",
					"order": 72,
					"setup": { "fields": [{
						"key": "profile",
						"kind": "string",
						"cli": {
							"flags": "--profile <profile>",
							"description": "Raft CLI profile"
						}
					}] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/raft",
					"npmSpec": "@testclaw/raft",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@testclaw/signal",
			"version": "2026.9.5",
			"description": "Assistant Signal channel plugin",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "signal",
					"approvalFlags": ["native"],
					"label": "Signal",
					"selectionLabel": "Signal (signal-cli)",
					"detailLabel": "Signal REST",
					"docsPath": "/channels/signal",
					"docsLabel": "signal",
					"blurb": "signal-cli linked device with additional setup for the local REST bridge.",
					"systemImage": "antenna.radiowaves.left.and.right",
					"markdownCapable": true,
					"setup": { "fields": [
						{
							"key": "signalNumber",
							"kind": "string",
							"cli": {
								"flags": "--signal-number <e164>",
								"description": "Signal account number (E.164)"
							}
						},
						{
							"key": "signalTransport",
							"kind": "choice",
							"choices": ["external-native", "container"],
							"cli": {
								"flags": "--signal-transport <kind>",
								"description": "Signal HTTP transport (external-native or container)"
							}
						},
						{
							"key": "cliPath",
							"kind": "string",
							"cli": {
								"flags": "--cli-path <path>",
								"description": "signal-cli executable path"
							}
						},
						{
							"key": "httpUrl",
							"kind": "string",
							"cli": {
								"flags": "--http-url <url>",
								"description": "Signal HTTP service URL"
							}
						},
						{
							"key": "httpHost",
							"kind": "string",
							"cli": {
								"flags": "--http-host <host>",
								"description": "Signal HTTP daemon host"
							}
						},
						{
							"key": "httpPort",
							"kind": "string",
							"cli": {
								"flags": "--http-port <port>",
								"description": "Signal HTTP daemon port"
							}
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/signal",
					"npmSpec": "@testclaw/signal",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/slack",
			"version": "2026.9.5",
			"description": "Assistant Slack channel plugin for channels, DMs, commands, and app events.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channelConfigs": { "slack": {
					"label": "Slack",
					"description": "Slack channel, DM, command, and app event integration."
				} },
				"channel": {
					"id": "slack",
					"configuredState": {
						"env": { "anyOf": [
							"SLACK_BOT_TOKEN",
							"SLACK_APP_TOKEN",
							"SLACK_USER_TOKEN"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredSlackChannelState"
					},
					"approvalFlags": ["native"],
					"label": "Slack",
					"selectionLabel": "Slack (Socket Mode)",
					"detailLabel": "Slack Bot",
					"docsPath": "/channels/slack",
					"docsLabel": "slack",
					"blurb": "supported (Socket Mode).",
					"systemImage": "number",
					"markdownCapable": true,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "route",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					},
					"commands": {
						"nativeCommandsAutoEnabled": false,
						"nativeSkillsAutoEnabled": false
					},
					"setup": { "fields": [
						{
							"key": "botToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--bot-token <token>",
								"description": "Slack bot token"
							}
						},
						{
							"key": "appToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--app-token <token>",
								"description": "Slack app token"
							}
						},
						{
							"key": "userToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--user-token <token>",
								"description": "Slack user token"
							}
						},
						{
							"key": "signingSecret",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--signing-secret <secret>",
								"description": "Slack signing secret"
							}
						},
						{
							"key": "identity",
							"kind": "choice",
							"choices": ["bot", "user"],
							"cli": {
								"flags": "--identity <kind>",
								"description": "Slack identity"
							}
						},
						{
							"key": "mode",
							"kind": "choice",
							"choices": ["socket", "http"],
							"cli": {
								"flags": "--mode <mode>",
								"description": "Slack connection mode"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Slack environment credentials"
							},
							"envVars": ["SLACK_BOT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/slack",
					"npmSpec": "@testclaw/slack",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.28",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/sms",
			"version": "2026.9.5",
			"description": "Assistant SMS/MMS channel plugin for Twilio messages.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "sms",
					"configuredState": {
						"env": { "anyOf": [
							"TWILIO_ACCOUNT_SID",
							"TWILIO_AUTH_TOKEN",
							"TWILIO_PHONE_NUMBER",
							"TWILIO_SMS_FROM",
							"TWILIO_MESSAGING_SERVICE_SID"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredSmsChannelState"
					},
					"label": "SMS",
					"selectionLabel": "SMS (Twilio)",
					"detailLabel": "Twilio SMS/MMS",
					"docsPath": "/channels/sms",
					"docsLabel": "sms",
					"blurb": "Twilio-backed SMS/MMS with inbound webhooks and outbound replies.",
					"order": 88,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "accountSid",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--account-sid <sid>",
								"description": "Twilio account SID"
							}
						},
						{
							"key": "authToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--auth-token <token>",
								"description": "Twilio auth token"
							}
						},
						{
							"key": "fromNumber",
							"kind": "string",
							"cli": {
								"flags": "--from-number <e164>",
								"description": "Twilio sender phone number"
							}
						},
						{
							"key": "messagingServiceSid",
							"kind": "string",
							"cli": {
								"flags": "--messaging-service-sid <sid>",
								"description": "Twilio Messaging Service SID"
							}
						},
						{
							"key": "defaultTo",
							"kind": "string",
							"cli": {
								"flags": "--default-to <e164>",
								"description": "Default SMS recipient"
							}
						},
						{
							"key": "webhookPath",
							"kind": "string",
							"cli": {
								"flags": "--webhook-path <path>",
								"description": "SMS webhook path"
							}
						},
						{
							"key": "publicWebhookUrl",
							"kind": "string",
							"cli": {
								"flags": "--public-webhook-url <url>",
								"description": "Public SMS webhook URL"
							}
						},
						{
							"key": "dmPolicy",
							"kind": "choice",
							"choices": [
								"pairing",
								"allowlist",
								"open",
								"disabled"
							],
							"cli": {
								"flags": "--dm-policy <policy>",
								"description": "SMS DM policy"
							}
						},
						{
							"key": "allowFrom",
							"kind": "string-list",
							"cli": {
								"flags": "--allow-from <numbers>",
								"description": "Allowed SMS senders"
							}
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/sms",
					"npmSpec": "@testclaw/sms",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@testclaw/synology-chat",
			"version": "2026.9.5",
			"description": "Synology Chat channel plugin for Assistant channels and direct messages.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "synology-chat",
					"configuredState": { "env": { "allOf": ["SYNOLOGY_CHAT_TOKEN", "SYNOLOGY_CHAT_INCOMING_URL"] } },
					"label": "Synology Chat",
					"selectionLabel": "Synology Chat (Webhook)",
					"docsPath": "/channels/synology-chat",
					"docsLabel": "synology-chat",
					"blurb": "Connect your Synology NAS Chat to Assistant with full agent capabilities.",
					"order": 90,
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "Synology Chat token"
							}
						},
						{
							"key": "url",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--url <url>",
								"description": "Synology Chat webhook URL"
							}
						},
						{
							"key": "webhookUrl",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--webhook-url <url>",
								"description": "Public HTTPS Synology Chat callback URL used for attachments"
							}
						},
						{
							"key": "webhookPath",
							"kind": "string",
							"cli": {
								"flags": "--webhook-path <path>",
								"description": "Synology Chat webhook path"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Synology Chat environment credentials"
							},
							"envVars": ["SYNOLOGY_CHAT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/synology-chat",
					"npmSpec": "@testclaw/synology-chat",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/tlon",
			"version": "2026.9.5",
			"description": "Assistant Tlon/Urbit channel plugin for chat workflows.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "tlon",
					"label": "Tlon",
					"selectionLabel": "Tlon (Urbit)",
					"docsPath": "/channels/tlon",
					"docsLabel": "tlon",
					"blurb": "decentralized messaging on Urbit; install the plugin to enable.",
					"order": 90,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "ship",
							"kind": "string",
							"cli": {
								"flags": "--ship <ship>",
								"description": "Tlon ship"
							}
						},
						{
							"key": "url",
							"kind": "string",
							"cli": {
								"flags": "--url <url>",
								"description": "Tlon URL"
							}
						},
						{
							"key": "code",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--code <code>",
								"description": "Tlon login code"
							}
						},
						{
							"key": "dangerouslyAllowPrivateNetwork",
							"kind": "boolean",
							"cli": {
								"flags": "--dangerously-allow-private-network",
								"description": "Allow private-network Tlon URLs"
							}
						},
						{
							"key": "groupChannels",
							"kind": "string-list",
							"cli": {
								"flags": "--group-channels <list>",
								"description": "Tlon group channels"
							}
						},
						{
							"key": "dmAllowlist",
							"kind": "string-list",
							"cli": {
								"flags": "--dm-allowlist <list>",
								"description": "Tlon DM allowlist"
							}
						},
						{
							"key": "autoDiscoverChannels",
							"kind": "boolean",
							"cli": {
								"flags": "--auto-discover-channels",
								"negatedFlags": "--no-auto-discover-channels",
								"description": "Auto-discover Tlon group channels"
							}
						},
						{
							"key": "ownerShip",
							"kind": "string",
							"cli": {
								"flags": "--owner-ship <ship>",
								"description": "Tlon owner ship"
							}
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/tlon",
					"npmSpec": "@testclaw/tlon",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/twitch",
			"version": "2026.9.5",
			"description": "Assistant Twitch channel plugin for chat and moderation workflows.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "twitch",
					"configuredState": { "env": { "anyOf": ["TESTCLAW_TWITCH_ACCESS_TOKEN"] } },
					"label": "Twitch",
					"selectionLabel": "Twitch (Chat)",
					"docsPath": "/channels/twitch",
					"blurb": "Twitch chat integration",
					"aliases": ["twitch-chat"],
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/twitch",
					"npmSpec": "@testclaw/twitch",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@wecom/wecom-testclaw-plugin",
			"description": "Assistant WeCom channel plugin by the Tencent WeCom team.",
			"source": "external",
			"kind": "channel",
			"testclaw": {
				"plugin": {
					"id": "wecom-testclaw-plugin",
					"label": "WeCom"
				},
				"contracts": { "tools": ["wecom_mcp"] },
				"channel": {
					"id": "wecom",
					"label": "WeCom",
					"selectionLabel": "WeCom（企业微信）",
					"detailLabel": "WeCom",
					"docsPath": "/channels/wecom",
					"docsLabel": "wecom",
					"blurb": "Enterprise messaging and documents, scheduling, task tools.",
					"aliases": [
						"qywx",
						"wework",
						"enterprise-wechat"
					],
					"order": 45
				},
				"channelConfigs": { "wecom": {
					"label": "WeCom",
					"description": "Enterprise WeChat conversation channel.",
					"schema": {
						"type": "object",
						"additionalProperties": true
					}
				} },
				"install": {
					"npmSpec": "@wecom/wecom-testclaw-plugin@2026.7.2",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-7kqdBIOF3SgDDoBoFtO6jxnxofbYSgbKdxZDNabD0y0jg2xKcVqlXZOOJ9+XQho/QOtIFrnRH2IRnPukFEYwJg=="
				}
			}
		},
		{
			"name": "@testclaw/whatsapp",
			"version": "2026.9.5",
			"description": "Assistant WhatsApp channel plugin for WhatsApp Web chats.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"contracts": { "tools": ["whatsapp_call", "whatsapp_login"] },
				"channel": {
					"id": "whatsapp",
					"approvalFlags": ["native"],
					"label": "WhatsApp",
					"selectionLabel": "WhatsApp (QR link)",
					"detailLabel": "WhatsApp Web",
					"docsPath": "/channels/whatsapp",
					"docsLabel": "whatsapp",
					"blurb": "works with your own number; recommend a separate phone + eSIM.",
					"systemImage": "message",
					"persistedAuthState": {
						"specifier": "./auth-presence",
						"exportName": "hasAnyWhatsAppAuth"
					},
					"setup": { "fields": [{
						"key": "authDir",
						"kind": "string",
						"cli": {
							"flags": "--auth-dir <path>",
							"description": "WhatsApp auth directory override"
						}
					}] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/whatsapp",
					"npmSpec": "@testclaw/whatsapp",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.25"
				}
			}
		},
		{
			"name": "testclaw-plugin-yuanbao",
			"description": "Assistant Yuanbao channel plugin by the Tencent Yuanbao team.",
			"source": "external",
			"kind": "channel",
			"testclaw": {
				"plugin": {
					"id": "testclaw-plugin-yuanbao",
					"label": "Yuanbao"
				},
				"contracts": { "tools": [
					"query_group_info",
					"query_session_members",
					"yuanbao_remind"
				] },
				"channel": {
					"id": "yuanbao",
					"label": "Yuanbao",
					"selectionLabel": "Yuanbao (元宝)",
					"detailLabel": "Yuanbao",
					"docsPath": "/channels/yuanbao",
					"docsLabel": "yuanbao",
					"blurb": "Tencent Yuanbao AI assistant conversation channel.",
					"aliases": [
						"yuanbao",
						"yb",
						"tencent-yuanbao",
						"元宝"
					],
					"order": 85
				},
				"channelConfigs": { "yuanbao": {
					"label": "Yuanbao",
					"description": "Tencent Yuanbao AI assistant channel.",
					"schema": {
						"type": "object",
						"additionalProperties": true
					}
				} },
				"install": {
					"npmSpec": "testclaw-plugin-yuanbao@2.18.2",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-cL85zWLePhi/GWRsXL8ogS4tejNuCE/J0V/OYhDFJzElF2TmndVCUAXaJdssgv/ULJ9sBaic88wAzRllIgZIwA=="
				}
			}
		},
		{
			"name": "@testclaw/zalo",
			"version": "2026.9.5",
			"description": "Assistant Zalo channel plugin for bot and webhook chats.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"channel": {
					"id": "zalo",
					"configuredState": { "env": { "anyOf": ["ZALO_BOT_TOKEN"] } },
					"label": "Zalo",
					"selectionLabel": "Zalo (Bot API)",
					"docsPath": "/channels/zalo",
					"docsLabel": "zalo",
					"blurb": "Vietnam-focused messaging platform with Bot API.",
					"aliases": ["zl"],
					"order": 80,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "Zalo bot token"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "Zalo bot token file"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use ZALO_BOT_TOKEN"
							},
							"envVars": ["ZALO_BOT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/zalo",
					"npmSpec": "@testclaw/zalo",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@testclaw/zalouser",
			"version": "2026.9.5",
			"description": "Assistant Zalo Personal Account plugin via native zca-js integration.",
			"source": "official",
			"kind": "channel",
			"testclaw": {
				"contracts": { "tools": ["zalouser"] },
				"channel": {
					"id": "zalouser",
					"configuredState": { "env": { "anyOf": ["ZALOUSER_PROFILE", "ZCA_PROFILE"] } },
					"label": "Zalo Personal",
					"selectionLabel": "Zalo (Personal Account)",
					"docsPath": "/channels/zalouser",
					"docsLabel": "zalouser",
					"blurb": "Zalo personal account via QR code login.",
					"aliases": ["zlu"],
					"order": 85,
					"quickstartAllowFrom": false,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "hybrid",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					},
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@testclaw/zalouser",
					"npmSpec": "@testclaw/zalouser",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		}
	] },
	official_external_provider_catalog_default,
	{
		schemaVersion: 1,
		id: "testclaw-official-external-plugins",
		generatedAt: "2026-06-22T00:00:00.000Z",
		sequence: 1,
		description: "Bundled fallback feed for official external Assistant plugins.",
		entries: [
			{
				"name": "@testclaw/acpx",
				"description": "Assistant ACP runtime backend",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "acpx",
						"label": "ACPX Runtime"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/acpx",
						"npmSpec": "@testclaw/acpx",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.25"
					}
				}
			},
			{
				"name": "@testclaw/brave-plugin",
				"description": "Assistant Brave plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "brave",
						"label": "Brave"
					},
					"webSearchProviders": [{
						"id": "brave",
						"label": "Brave Search",
						"hint": "Brave Search web results.",
						"onboardingScopes": ["text-inference"],
						"credentialLabel": "Brave Search API key",
						"envVars": ["BRAVE_API_KEY"],
						"placeholder": "BSA...",
						"signupUrl": "https://api-dashboard.search.brave.com/app/keys",
						"docsUrl": "https://docs.testclaw.ai/tools/brave-search",
						"credentialPath": "plugins.entries.brave.config.webSearch.apiKey",
						"autoDetectOrder": 10
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/brave-plugin",
						"npmSpec": "@testclaw/brave-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.10",
						"allowInvalidConfigRecovery": true
					}
				}
			},
			{
				"name": "@testclaw/codex",
				"description": "Assistant Codex app-server harness and native session catalog",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "codex",
						"label": "Codex"
					},
					"contracts": { "migrationProviders": ["codex"] },
					"install": {
						"clawhubSpec": "clawhub:@testclaw/codex",
						"npmSpec": "@testclaw/codex",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.1-beta.1"
					},
					"setup": { "nativeSessionCatalog": {
						"label": "Codex",
						"legacyDefaultEnabled": true,
						"description": "Existing native Codex conversations on this Gateway and eligible paired nodes.",
						"nodeCommands": [
							"codex.appServer.threads.list.v1",
							"codex.appServer.thread.turns.list.v1",
							"codex.sessionCatalog.transcript.read.v1",
							"codex.terminal.resume.v1",
							"codex.cli.sessions.list"
						]
					} }
				}
			},
			{
				"name": "@testclaw/copilot",
				"description": "Assistant GitHub Copilot agent runtime plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "copilot",
						"label": "GitHub Copilot agent runtime"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/copilot",
						"npmSpec": "@testclaw/copilot",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.28"
					}
				}
			},
			{
				"name": "@testclaw/diagnostics-otel",
				"description": "Assistant diagnostics OpenTelemetry exporter",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "diagnostics-otel",
						"label": "Diagnostics OpenTelemetry"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/diagnostics-otel",
						"npmSpec": "@testclaw/diagnostics-otel",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.25"
					}
				}
			},
			{
				"name": "@testclaw/diagnostics-prometheus",
				"description": "Assistant diagnostics Prometheus exporter",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "diagnostics-prometheus",
						"label": "Diagnostics Prometheus"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/diagnostics-prometheus",
						"npmSpec": "@testclaw/diagnostics-prometheus",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.25"
					}
				}
			},
			{
				"name": "@testclaw/diffs",
				"description": "Assistant diff viewer plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "diffs",
						"label": "Diffs"
					},
					"catalog": {
						"featured": true,
						"order": 40
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/diffs",
						"npmSpec": "@testclaw/diffs",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.30"
					}
				}
			},
			{
				"name": "@testclaw/diffs-language-pack",
				"description": "Assistant diffs viewer syntax highlighting language pack",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "diffs-language-pack",
						"label": "Diff Viewer Language Pack"
					},
					"install": {
						"npmSpec": "@testclaw/diffs-language-pack",
						"clawhubSpec": "clawhub:@testclaw/diffs-language-pack",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.27"
					}
				}
			},
			{
				"name": "@testclaw/duckduckgo-plugin",
				"description": "Assistant DuckDuckGo plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "duckduckgo",
						"label": "DuckDuckGo"
					},
					"contracts": { "webSearchProviders": ["duckduckgo"] },
					"webSearchProviders": [{
						"id": "duckduckgo",
						"label": "DuckDuckGo Search (experimental)",
						"hint": "Free web search fallback with no API key required",
						"onboardingScopes": ["text-inference"],
						"requiresCredential": false,
						"envVars": [],
						"placeholder": "(no key needed)",
						"signupUrl": "https://duckduckgo.com/",
						"docsUrl": "https://docs.testclaw.ai/tools/duckduckgo-search",
						"credentialPath": "",
						"autoDetectOrder": 100
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/duckduckgo-plugin",
						"npmSpec": "@testclaw/duckduckgo-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
					}
				}
			},
			{
				"name": "@testclaw/exa-plugin",
				"description": "Assistant Exa plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "exa",
						"label": "Exa"
					},
					"contracts": { "webSearchProviders": ["exa"] },
					"webSearchProviders": [{
						"id": "exa",
						"label": "Exa Search",
						"hint": "Neural + keyword search with date filters and content extraction",
						"onboardingScopes": ["text-inference"],
						"credentialLabel": "Exa API key",
						"envVars": ["EXA_API_KEY"],
						"placeholder": "exa-...",
						"signupUrl": "https://exa.ai/",
						"docsUrl": "https://docs.testclaw.ai/tools/web",
						"credentialPath": "plugins.entries.exa.config.webSearch.apiKey",
						"autoDetectOrder": 65
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/exa-plugin",
						"npmSpec": "@testclaw/exa-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.8"
					}
				}
			},
			{
				"name": "@testclaw/facetime",
				"description": "Experimental Assistant FaceTime realtime voice carrier",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "facetime",
						"label": "FaceTime"
					},
					"contracts": { "tools": ["facetime_call"] },
					"install": {
						"clawhubSpec": "clawhub:@testclaw/facetime",
						"npmSpec": "@testclaw/facetime",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.4",
						"allowInvalidConfigRecovery": true
					}
				}
			},
			{
				"name": "@testclaw/firecrawl-plugin",
				"description": "Assistant Firecrawl plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "firecrawl",
						"label": "Firecrawl"
					},
					"contracts": {
						"webFetchProviders": ["firecrawl"],
						"webSearchProviders": ["firecrawl", "firecrawl-free"],
						"tools": ["firecrawl_search", "firecrawl_scrape"]
					},
					"webSearchProviders": [{
						"id": "firecrawl",
						"label": "Firecrawl Search",
						"hint": "Structured results with optional result scraping",
						"onboardingScopes": ["text-inference"],
						"credentialLabel": "Firecrawl API key",
						"envVars": ["FIRECRAWL_API_KEY"],
						"placeholder": "fc-...",
						"signupUrl": "https://www.firecrawl.dev/",
						"docsUrl": "https://docs.testclaw.ai/tools/firecrawl",
						"credentialPath": "plugins.entries.firecrawl.config.webSearch.apiKey",
						"autoDetectOrder": 60
					}, {
						"id": "firecrawl-free",
						"label": "Firecrawl Search (Free)",
						"hint": "Free web search via Firecrawl's hosted starter tier — no API key required",
						"onboardingScopes": ["text-inference"],
						"requiresCredential": false,
						"envVars": [],
						"placeholder": "(no key needed)",
						"signupUrl": "https://www.firecrawl.dev/",
						"docsUrl": "https://docs.testclaw.ai/tools/firecrawl",
						"credentialPath": ""
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/firecrawl-plugin",
						"npmSpec": "@testclaw/firecrawl-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.8"
					}
				}
			},
			{
				"name": "@testclaw/fish-audio-speech",
				"description": "Assistant Fish Audio speech plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"legacyPluginIds": ["fish-audio"],
					"plugin": {
						"id": "fish-audio-speech",
						"label": "Fish Audio Speech"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/fish-audio-speech",
						"npmSpec": "@testclaw/fish-audio-speech",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
					}
				}
			},
			{
				"name": "@testclaw/google-meet",
				"description": "Assistant Google Meet participant plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "google-meet",
						"label": "Google Meet"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/google-meet",
						"npmSpec": "@testclaw/google-meet",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.20"
					}
				}
			},
			{
				"name": "@testclaw/gradium-speech",
				"description": "Assistant Gradium speech plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "gradium",
						"label": "Gradium"
					},
					"contracts": { "speechProviders": ["gradium"] },
					"install": {
						"clawhubSpec": "clawhub:@testclaw/gradium-speech",
						"npmSpec": "@testclaw/gradium-speech",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.8"
					}
				}
			},
			{
				"name": "@testclaw/inworld-speech",
				"description": "Assistant Inworld speech plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "inworld",
						"label": "Inworld"
					},
					"contracts": { "speechProviders": ["inworld"] },
					"install": {
						"clawhubSpec": "clawhub:@testclaw/inworld-speech",
						"npmSpec": "@testclaw/inworld-speech",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.8"
					}
				}
			},
			{
				"name": "@testclaw/lobster",
				"description": "Lobster workflow tool plugin (typed pipelines + resumable approvals)",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "lobster",
						"label": "Lobster"
					},
					"catalog": {
						"featured": true,
						"order": 50
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/lobster",
						"npmSpec": "@testclaw/lobster",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.25"
					}
				}
			},
			{
				"name": "@testclaw/memory-lancedb",
				"description": "Assistant LanceDB-backed long-term memory plugin with auto-recall/capture",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "memory-lancedb",
						"label": "Memory LanceDB"
					},
					"catalog": {
						"featured": true,
						"order": 70
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/memory-lancedb",
						"npmSpec": "@testclaw/memory-lancedb",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.31"
					}
				}
			},
			{
				"name": "@testclaw/llama-cpp-provider",
				"description": "Assistant managed llama.cpp server provider plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "llama-cpp",
						"label": "llama.cpp Provider"
					},
					"contracts": { "embeddingProviders": ["local"] },
					"install": {
						"clawhubSpec": "clawhub:@testclaw/llama-cpp-provider",
						"npmSpec": "@testclaw/llama-cpp-provider",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.2"
					}
				}
			},
			{
				"name": "@testclaw/mxc-sandbox",
				"description": "Assistant MXC sandbox execution plugin for MXC-capable hosts",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "mxc",
						"label": "MXC Sandbox Execution"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/mxc-sandbox",
						"npmSpec": "@testclaw/mxc-sandbox",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.11"
					}
				}
			},
			{
				"name": "@testclaw/onnx",
				"description": "Local ONNX decision models for Assistant",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "onnx",
						"label": "ONNX"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/onnx",
						"npmSpec": "@testclaw/onnx",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.6"
					}
				}
			},
			{
				"name": "@testclaw/openshell-sandbox",
				"description": "Assistant OpenShell sandbox backend",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "openshell",
						"label": "OpenShell Sandbox"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/openshell-sandbox",
						"npmSpec": "@testclaw/openshell-sandbox",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.12-beta.1"
					}
				}
			},
			{
				"name": "@testclaw/parallel-plugin",
				"description": "Assistant Parallel web search plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "parallel",
						"label": "Parallel"
					},
					"contracts": { "webSearchProviders": ["parallel", "parallel-free"] },
					"webSearchProviders": [{
						"id": "parallel",
						"label": "Parallel Search",
						"hint": "LLM-optimized dense excerpts from web sources",
						"onboardingScopes": ["text-inference"],
						"credentialLabel": "Parallel API key",
						"envVars": ["PARALLEL_API_KEY"],
						"placeholder": "par-...",
						"signupUrl": "https://platform.parallel.ai",
						"docsUrl": "https://docs.testclaw.ai/tools/parallel-search",
						"credentialPath": "plugins.entries.parallel.config.webSearch.apiKey",
						"autoDetectOrder": 75
					}, {
						"id": "parallel-free",
						"label": "Parallel Search (Free)",
						"hint": "Free web search via Parallel's hosted Search MCP — no API key required",
						"onboardingScopes": ["text-inference"],
						"requiresCredential": false,
						"envVars": [],
						"placeholder": "(no key needed)",
						"signupUrl": "https://parallel.ai",
						"docsUrl": "https://docs.testclaw.ai/tools/parallel-search",
						"credentialPath": ""
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/parallel-plugin",
						"npmSpec": "@testclaw/parallel-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.8"
					}
				}
			},
			{
				"name": "@testclaw/perplexity-plugin",
				"description": "Assistant Perplexity plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "perplexity",
						"label": "Perplexity"
					},
					"contracts": { "webSearchProviders": ["perplexity"] },
					"webSearchProviders": [{
						"id": "perplexity",
						"label": "Perplexity Search",
						"hint": "Requires Perplexity API key or OpenRouter API key · structured results",
						"onboardingScopes": ["text-inference"],
						"credentialLabel": "Perplexity API key",
						"envVars": ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
						"placeholder": "pplx-...",
						"signupUrl": "https://www.perplexity.ai/settings/api",
						"docsUrl": "https://docs.testclaw.ai/perplexity",
						"credentialPath": "plugins.entries.perplexity.config.webSearch.apiKey",
						"autoDetectOrder": 50
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/perplexity-plugin",
						"npmSpec": "@testclaw/perplexity-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.8"
					}
				}
			},
			{
				"name": "@testclaw/searxng-plugin",
				"description": "Assistant SearXNG plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "searxng",
						"label": "SearXNG"
					},
					"contracts": { "webSearchProviders": ["searxng"] },
					"webSearchProviders": [{
						"id": "searxng",
						"label": "SearXNG Search",
						"hint": "Self-hosted meta-search with no API key required",
						"onboardingScopes": ["text-inference"],
						"requiresCredential": true,
						"credentialLabel": "SearXNG Base URL",
						"envVars": ["SEARXNG_BASE_URL"],
						"placeholder": "http://localhost:8080",
						"signupUrl": "https://docs.searxng.org/",
						"docsUrl": "https://docs.testclaw.ai/tools/searxng-search",
						"credentialPath": "plugins.entries.searxng.config.webSearch.baseUrl",
						"autoDetectOrder": 200
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/searxng-plugin",
						"npmSpec": "@testclaw/searxng-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.9",
						"allowInvalidConfigRecovery": true
					}
				}
			},
			{
				"name": "@testclaw/tavily-plugin",
				"description": "Assistant Tavily plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "tavily",
						"label": "Tavily"
					},
					"contracts": {
						"webSearchProviders": ["tavily"],
						"tools": ["tavily_search", "tavily_extract"]
					},
					"webSearchProviders": [{
						"id": "tavily",
						"label": "Tavily Search",
						"hint": "Structured results with domain filters and AI answer summaries",
						"onboardingScopes": ["text-inference"],
						"credentialLabel": "Tavily API key",
						"envVars": ["TAVILY_API_KEY"],
						"placeholder": "tvly-...",
						"signupUrl": "https://tavily.com/",
						"docsUrl": "https://docs.testclaw.ai/tools/tavily",
						"credentialPath": "plugins.entries.tavily.config.webSearch.apiKey",
						"autoDetectOrder": 70
					}],
					"install": {
						"clawhubSpec": "clawhub:@testclaw/tavily-plugin",
						"npmSpec": "@testclaw/tavily-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.9",
						"allowInvalidConfigRecovery": true
					}
				}
			},
			{
				"name": "@testclaw/team-reports",
				"description": "Assistant team activity reports plugin (GitHub org + Discord activity with model summaries)",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "team-reports",
						"label": "Team Reports"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/team-reports",
						"npmSpec": "@testclaw/team-reports",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.2"
					}
				}
			},
			{
				"name": "@testclaw/teams-meetings",
				"description": "Assistant Microsoft Teams browser meeting participant plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "teams-meetings",
						"label": "Microsoft Teams meetings"
					},
					"contracts": {
						"tools": ["teams_meetings"],
						"transcriptSourceProviders": ["teams"]
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/teams-meetings",
						"npmSpec": "@testclaw/teams-meetings",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
					}
				}
			},
			{
				"name": "@testclaw/tokenjuice",
				"description": "Assistant tokenjuice exec output compaction plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "tokenjuice",
						"label": "Tokenjuice"
					},
					"catalog": {
						"featured": true,
						"order": 60
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/tokenjuice",
						"npmSpec": "@testclaw/tokenjuice",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.28"
					}
				}
			},
			{
				"name": "@testclaw/typesafe",
				"description": "Assistant TypeSafe typed decisions and optional evaluation tool",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "typesafe",
						"label": "TypeSafe AI"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/typesafe",
						"npmSpec": "@testclaw/typesafe",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.6"
					}
				}
			},
			{
				"name": "@testclaw/voice-call",
				"description": "Assistant voice-call plugin",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "voice-call",
						"label": "Voice Call"
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/voice-call",
						"npmSpec": "@testclaw/voice-call",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.10"
					}
				}
			},
			{
				"name": "@testclaw/zoom-meetings",
				"description": "Assistant Zoom browser meeting participant plugin.",
				"source": "official",
				"kind": "plugin",
				"testclaw": {
					"plugin": {
						"id": "zoom-meetings",
						"label": "Zoom meetings"
					},
					"contracts": {
						"tools": ["zoom_meetings"],
						"transcriptSourceProviders": ["zoom"]
					},
					"install": {
						"clawhubSpec": "clawhub:@testclaw/zoom-meetings",
						"npmSpec": "@testclaw/zoom-meetings",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
					}
				}
			}
		]
	}
].flatMap((source) => source.entries.filter((entry) => isRecord(entry)));
//#endregion
export { BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES as t };
