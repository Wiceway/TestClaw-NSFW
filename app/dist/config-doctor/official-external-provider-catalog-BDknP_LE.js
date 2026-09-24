//#region scripts/lib/official-external-provider-catalog.json
var official_external_provider_catalog_default = { entries: [
	{
		"name": "@testclaw/amazon-bedrock-provider",
		"description": "Assistant Amazon Bedrock provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "amazon-bedrock",
				"label": "Amazon Bedrock"
			},
			"providers": [{
				"id": "amazon-bedrock",
				"name": "Amazon Bedrock",
				"docs": "/providers/bedrock",
				"categories": ["cloud", "llm"]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/amazon-bedrock-provider",
				"npmSpec": "@testclaw/amazon-bedrock-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1"
			}
		}
	},
	{
		"name": "@testclaw/amazon-bedrock-mantle-provider",
		"description": "Assistant Amazon Bedrock Mantle provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "amazon-bedrock-mantle",
				"label": "Amazon Bedrock Mantle"
			},
			"providers": [{
				"id": "amazon-bedrock-mantle",
				"name": "Amazon Bedrock Mantle",
				"docs": "/providers/bedrock-mantle",
				"categories": ["cloud", "llm"]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/amazon-bedrock-mantle-provider",
				"npmSpec": "@testclaw/amazon-bedrock-mantle-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1"
			}
		}
	},
	{
		"name": "@testclaw/anthropic-vertex-provider",
		"description": "Assistant Anthropic Vertex provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "anthropic-vertex",
				"label": "Anthropic Vertex"
			},
			"providers": [{
				"id": "anthropic-vertex",
				"name": "Anthropic Vertex",
				"docs": "/providers/models",
				"categories": ["cloud", "llm"]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/anthropic-vertex-provider",
				"npmSpec": "@testclaw/anthropic-vertex-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1"
			}
		}
	},
	{
		"name": "@testclaw/arcee-provider",
		"description": "Assistant Arcee provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "arcee",
				"label": "Arcee AI"
			},
			"providers": [{
				"id": "arcee",
				"name": "Arcee AI",
				"docs": "/providers/arcee",
				"categories": ["cloud", "llm"],
				"envVars": ["ARCEEAI_API_KEY"],
				"authChoices": [{
					"method": "arcee-platform",
					"choiceId": "arceeai-api-key",
					"choiceLabel": "Arcee AI API key",
					"choiceHint": "Direct (chat.arcee.ai)",
					"groupId": "arcee",
					"groupLabel": "Arcee AI",
					"groupHint": "Direct API or OpenRouter",
					"optionKey": "arceeaiApiKey",
					"cliFlag": "--arceeai-api-key",
					"cliOption": "--arceeai-api-key <key>",
					"cliDescription": "Arcee AI API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "openrouter",
					"choiceId": "arceeai-openrouter",
					"choiceLabel": "OpenRouter API key",
					"choiceHint": "Via OpenRouter (openrouter.ai)",
					"groupId": "arcee",
					"groupLabel": "Arcee AI",
					"groupHint": "Direct API or OpenRouter",
					"optionKey": "openrouterApiKey",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/arcee-provider",
				"npmSpec": "@testclaw/arcee-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/baseten-provider",
		"description": "Assistant Baseten provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "baseten",
				"label": "Baseten"
			},
			"providers": [{
				"id": "baseten",
				"name": "Baseten",
				"docs": "/providers/baseten",
				"categories": ["cloud", "llm"],
				"envVars": ["BASETEN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "baseten-api-key",
					"choiceLabel": "Baseten API key",
					"groupId": "baseten",
					"groupLabel": "Baseten",
					"groupHint": "Hosted Model APIs, including Inkling",
					"optionKey": "basetenApiKey",
					"cliFlag": "--baseten-api-key",
					"cliOption": "--baseten-api-key <key>",
					"cliDescription": "Baseten API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/baseten-provider",
				"npmSpec": "@testclaw/baseten-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/byteplus-provider",
		"description": "Assistant BytePlus provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "byteplus",
				"label": "BytePlus"
			},
			"providers": [{
				"id": "byteplus",
				"aliases": ["byteplus-plan"],
				"name": "BytePlus",
				"docs": "/concepts/model-providers#byteplus-international",
				"categories": ["cloud", "llm"],
				"envVars": ["BYTEPLUS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "byteplus-api-key",
					"choiceLabel": "BytePlus API key",
					"groupId": "byteplus",
					"groupLabel": "BytePlus",
					"groupHint": "API key",
					"optionKey": "byteplusApiKey",
					"cliFlag": "--byteplus-api-key",
					"cliOption": "--byteplus-api-key <key>",
					"cliDescription": "BytePlus API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": { "videoGenerationProviders": ["byteplus"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/byteplus-provider",
				"npmSpec": "@testclaw/byteplus-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/cerebras-provider",
		"description": "Assistant Cerebras provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "cerebras",
				"label": "Cerebras"
			},
			"providerEndpoints": [{
				"endpointClass": "cerebras-native",
				"hosts": ["api.cerebras.ai"]
			}],
			"providers": [{
				"id": "cerebras",
				"name": "Cerebras",
				"docs": "/providers/cerebras",
				"categories": ["cloud", "llm"],
				"envVars": ["CEREBRAS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "cerebras-api-key",
					"choiceLabel": "Cerebras API key",
					"groupId": "cerebras",
					"groupLabel": "Cerebras",
					"groupHint": "Fast OpenAI-compatible inference",
					"optionKey": "cerebrasApiKey",
					"cliFlag": "--cerebras-api-key",
					"cliOption": "--cerebras-api-key <key>",
					"cliDescription": "Cerebras API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/cerebras-provider",
				"npmSpec": "@testclaw/cerebras-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/chutes-provider",
		"description": "Assistant Chutes.ai provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "chutes",
				"label": "Chutes"
			},
			"providerEndpoints": [{
				"endpointClass": "chutes-native",
				"hosts": ["llm.chutes.ai"]
			}],
			"providers": [{
				"id": "chutes",
				"name": "Chutes",
				"docs": "/providers/chutes",
				"categories": ["cloud", "llm"],
				"envVars": ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"],
				"authChoices": [{
					"method": "oauth",
					"choiceId": "chutes",
					"choiceLabel": "Chutes (OAuth)",
					"choiceHint": "Browser sign-in",
					"groupId": "chutes",
					"groupLabel": "Chutes",
					"groupHint": "OAuth + API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "api-key",
					"choiceId": "chutes-api-key",
					"choiceLabel": "Chutes API key",
					"choiceHint": "Open-source models including Llama, DeepSeek, and more",
					"groupId": "chutes",
					"groupLabel": "Chutes",
					"groupHint": "OAuth + API key",
					"optionKey": "chutesApiKey",
					"cliFlag": "--chutes-api-key",
					"cliOption": "--chutes-api-key <key>",
					"cliDescription": "Chutes API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/chutes-provider",
				"npmSpec": "@testclaw/chutes-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/cohere-provider",
		"description": "Assistant Cohere provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "cohere",
				"label": "Cohere"
			},
			"providers": [{
				"id": "cohere",
				"name": "Cohere",
				"docs": "/providers/cohere",
				"categories": ["cloud", "llm"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "cohere-api-key",
					"choiceLabel": "Cohere API key",
					"groupId": "cohere",
					"groupLabel": "Cohere",
					"groupHint": "OpenAI-compatible inference",
					"optionKey": "cohereApiKey",
					"cliFlag": "--cohere-api-key",
					"cliOption": "--cohere-api-key <key>",
					"cliDescription": "Cohere API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/cohere-provider",
				"npmSpec": "@testclaw/cohere-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/cloudflare-ai-gateway-provider",
		"description": "Assistant Cloudflare AI Gateway provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "cloudflare-ai-gateway",
				"label": "Cloudflare AI Gateway"
			},
			"providers": [{
				"id": "cloudflare-ai-gateway",
				"name": "Cloudflare AI Gateway",
				"docs": "/providers/cloudflare-ai-gateway",
				"categories": ["cloud", "llm"],
				"envVars": ["CLOUDFLARE_AI_GATEWAY_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "cloudflare-ai-gateway-api-key",
					"choiceLabel": "Cloudflare AI Gateway",
					"choiceHint": "Account ID + Gateway ID + API key",
					"groupId": "cloudflare-ai-gateway",
					"groupLabel": "Cloudflare AI Gateway",
					"groupHint": "Account ID + Gateway ID + API key",
					"optionKey": "cloudflareAiGatewayApiKey",
					"cliFlag": "--cloudflare-ai-gateway-api-key",
					"cliOption": "--cloudflare-ai-gateway-api-key <key>",
					"cliDescription": "Cloudflare AI Gateway API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/cloudflare-ai-gateway-provider",
				"npmSpec": "@testclaw/cloudflare-ai-gateway-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/comfy-provider",
		"description": "Assistant ComfyUI provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "comfy",
				"label": "ComfyUI"
			},
			"providers": [{
				"id": "comfy",
				"name": "ComfyUI",
				"docs": "/providers/comfy",
				"categories": [
					"local",
					"cloud",
					"media"
				],
				"envVars": ["COMFY_API_KEY", "COMFY_CLOUD_API_KEY"],
				"authChoices": [{
					"method": "cloud-api-key",
					"choiceId": "comfy-cloud-api-key",
					"choiceLabel": "Comfy Cloud API key",
					"choiceHint": "Required for cloud workflows",
					"groupId": "comfy",
					"groupLabel": "ComfyUI",
					"groupHint": "Local or cloud workflows",
					"optionKey": "comfyApiKey",
					"cliFlag": "--comfy-api-key",
					"cliOption": "--comfy-api-key <key>",
					"cliDescription": "Comfy Cloud API key",
					"onboardingScopes": ["image-generation"]
				}]
			}],
			"contracts": {
				"imageGenerationProviders": ["comfy"],
				"musicGenerationProviders": ["comfy"],
				"videoGenerationProviders": ["comfy"]
			},
			"install": {
				"clawhubSpec": "clawhub:@testclaw/comfy-provider",
				"npmSpec": "@testclaw/comfy-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/deepinfra-provider",
		"description": "Assistant DeepInfra provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "deepinfra",
				"label": "DeepInfra"
			},
			"providerEndpoints": [{
				"endpointClass": "deepinfra-native",
				"hosts": ["api.deepinfra.com"]
			}],
			"providers": [{
				"id": "deepinfra",
				"name": "DeepInfra",
				"docs": "/providers/deepinfra",
				"categories": ["cloud", "llm"],
				"envVars": ["DEEPINFRA_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "deepinfra-api-key",
					"choiceLabel": "DeepInfra API key",
					"choiceHint": "Unified API for open source models",
					"groupId": "deepinfra",
					"groupLabel": "DeepInfra",
					"groupHint": "Unified API for open source models",
					"optionKey": "deepinfraApiKey",
					"cliFlag": "--deepinfra-api-key",
					"cliOption": "--deepinfra-api-key <key>",
					"cliDescription": "DeepInfra API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": {
				"mediaUnderstandingProviders": ["deepinfra"],
				"embeddingProviders": ["deepinfra"],
				"imageGenerationProviders": ["deepinfra"],
				"speechProviders": ["deepinfra"],
				"videoGenerationProviders": ["deepinfra"]
			},
			"install": {
				"clawhubSpec": "clawhub:@testclaw/deepinfra-provider",
				"npmSpec": "@testclaw/deepinfra-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/deepseek-provider",
		"description": "Assistant DeepSeek provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "deepseek",
				"label": "DeepSeek"
			},
			"providerEndpoints": [{
				"endpointClass": "deepseek-native",
				"hosts": ["api.deepseek.com"]
			}],
			"providers": [{
				"id": "deepseek",
				"name": "DeepSeek",
				"docs": "/providers/deepseek",
				"categories": ["cloud", "llm"],
				"envVars": ["DEEPSEEK_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "deepseek-api-key",
					"choiceLabel": "DeepSeek API key",
					"groupId": "deepseek",
					"groupLabel": "DeepSeek",
					"groupHint": "API key",
					"optionKey": "deepseekApiKey",
					"cliFlag": "--deepseek-api-key",
					"cliOption": "--deepseek-api-key <key>",
					"cliDescription": "DeepSeek API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/deepseek-provider",
				"npmSpec": "@testclaw/deepseek-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/featherless-provider",
		"description": "Assistant Featherless AI provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "featherless",
				"label": "Featherless AI"
			},
			"providers": [{
				"id": "featherless",
				"name": "Featherless AI",
				"docs": "/providers/featherless",
				"categories": ["cloud", "llm"],
				"envVars": ["FEATHERLESS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "featherless-api-key",
					"choiceLabel": "Featherless AI API key",
					"choiceHint": "OpenAI-compatible access to open models",
					"groupId": "featherless",
					"groupLabel": "Featherless AI",
					"groupHint": "OpenAI-compatible access to open models",
					"optionKey": "featherlessApiKey",
					"cliFlag": "--featherless-api-key",
					"cliOption": "--featherless-api-key <key>",
					"cliDescription": "Featherless AI API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/featherless-provider",
				"npmSpec": "@testclaw/featherless-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.11"
			}
		}
	},
	{
		"name": "@testclaw/gmi-provider",
		"description": "Assistant GMI Cloud provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "gmi",
				"label": "GMI Cloud"
			},
			"providerEndpoints": [{
				"endpointClass": "gmi-native",
				"hosts": ["api.gmi-serving.com"]
			}],
			"providers": [{
				"id": "gmi",
				"aliases": ["gmi-cloud", "gmicloud"],
				"name": "GMI Cloud",
				"docs": "/providers/gmi",
				"categories": ["cloud", "llm"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "gmi-api-key",
					"choiceLabel": "GMI Cloud API key",
					"choiceHint": "OpenAI-compatible GMI Cloud endpoint.",
					"groupId": "gmi",
					"groupLabel": "GMI Cloud",
					"groupHint": "OpenAI-compatible GMI Cloud endpoint",
					"optionKey": "gmiApiKey",
					"cliFlag": "--gmi-api-key",
					"cliOption": "--gmi-api-key <key>",
					"cliDescription": "GMI Cloud API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/gmi-provider",
				"npmSpec": "@testclaw/gmi-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/longcat-provider",
		"description": "Assistant LongCat provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "longcat",
				"label": "LongCat"
			},
			"providers": [{
				"id": "longcat",
				"aliases": ["meituan-longcat"],
				"name": "LongCat",
				"docs": "/providers/longcat",
				"categories": ["cloud", "llm"],
				"envVars": ["LONGCAT_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "longcat-api-key",
					"choiceLabel": "LongCat API key",
					"groupId": "longcat",
					"groupLabel": "LongCat",
					"groupHint": "OpenAI-compatible LongCat API",
					"optionKey": "longcatApiKey",
					"cliFlag": "--longcat-api-key",
					"cliOption": "--longcat-api-key <key>",
					"cliDescription": "LongCat API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/longcat-provider",
				"npmSpec": "@testclaw/longcat-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/meta-provider",
		"description": "Assistant Meta provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "meta",
				"label": "Meta"
			},
			"providerEndpoints": [{
				"endpointClass": "meta-native",
				"hosts": ["api.meta.ai"]
			}],
			"providers": [{
				"id": "meta",
				"name": "Meta",
				"docs": "/providers/meta",
				"categories": ["cloud", "llm"],
				"envVars": ["MODEL_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "meta-api-key",
					"choiceLabel": "Meta API key",
					"choiceHint": "Meta (Responses API)",
					"groupId": "meta",
					"groupLabel": "Meta",
					"groupHint": "Meta (Responses API)",
					"optionKey": "metaApiKey",
					"cliFlag": "--meta-api-key",
					"cliOption": "--meta-api-key <key>",
					"cliDescription": "Meta API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/meta-provider",
				"npmSpec": "@testclaw/meta-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.11"
			}
		}
	},
	{
		"name": "@testclaw/mistral-provider",
		"description": "Assistant Mistral provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "mistral",
				"label": "Mistral"
			},
			"providerEndpoints": [{
				"endpointClass": "mistral-public",
				"hosts": ["api.mistral.ai"]
			}],
			"providers": [{
				"id": "mistral",
				"name": "Mistral",
				"docs": "/providers/mistral",
				"categories": ["cloud", "llm"],
				"envVars": ["MISTRAL_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "mistral-api-key",
					"choiceLabel": "Mistral API key",
					"groupId": "mistral",
					"groupLabel": "Mistral AI",
					"groupHint": "API key",
					"optionKey": "mistralApiKey",
					"cliFlag": "--mistral-api-key",
					"cliOption": "--mistral-api-key <key>",
					"cliDescription": "Mistral API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": {
				"embeddingProviders": ["mistral"],
				"mediaUnderstandingProviders": ["mistral"],
				"realtimeTranscriptionProviders": ["mistral"]
			},
			"install": {
				"clawhubSpec": "clawhub:@testclaw/mistral-provider",
				"npmSpec": "@testclaw/mistral-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/novita-provider",
		"description": "Assistant NovitaAI provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "novita",
				"label": "NovitaAI"
			},
			"providerEndpoints": [{
				"endpointClass": "novita-native",
				"hosts": ["api.novita.ai"]
			}],
			"providers": [{
				"id": "novita",
				"aliases": ["novita-ai", "novitaai"],
				"name": "NovitaAI",
				"docs": "/providers/novita",
				"categories": ["cloud", "llm"],
				"envVars": ["NOVITA_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "novita-api-key",
					"choiceLabel": "NovitaAI API key",
					"choiceHint": "OpenAI-compatible NovitaAI endpoint",
					"groupId": "novita",
					"groupLabel": "NovitaAI",
					"groupHint": "OpenAI-compatible NovitaAI endpoint",
					"optionKey": "novitaApiKey",
					"cliFlag": "--novita-api-key",
					"cliOption": "--novita-api-key <key>",
					"cliDescription": "NovitaAI API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/novita-provider",
				"npmSpec": "@testclaw/novita-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/opencode-provider",
		"description": "Assistant OpenCode Zen provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "opencode",
				"label": "OpenCode Zen"
			},
			"providerEndpoints": [{
				"endpointClass": "opencode-native",
				"baseUrls": ["https://opencode.ai/zen", "https://opencode.ai/zen/v1"]
			}],
			"providers": [{
				"id": "opencode",
				"name": "OpenCode Zen",
				"docs": "/providers/opencode",
				"categories": ["cloud", "llm"],
				"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "opencode-zen",
					"choiceLabel": "OpenCode Zen catalog",
					"groupId": "opencode",
					"groupLabel": "OpenCode",
					"groupHint": "Shared API key for Zen + Go catalogs",
					"optionKey": "opencodeZenApiKey",
					"cliFlag": "--opencode-zen-api-key",
					"cliOption": "--opencode-zen-api-key <key>",
					"cliDescription": "OpenCode API key (Zen catalog)",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": { "mediaUnderstandingProviders": ["opencode"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/opencode-provider",
				"npmSpec": "@testclaw/opencode-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/groq-provider",
		"description": "Assistant Groq media-understanding provider.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "groq",
				"label": "Groq"
			},
			"providerEndpoints": [{
				"endpointClass": "groq-native",
				"hosts": ["api.groq.com"]
			}],
			"providers": [{
				"id": "groq",
				"name": "Groq",
				"docs": "/providers/groq",
				"categories": ["cloud", "llm"],
				"envVars": ["GROQ_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "groq-api-key",
					"choiceLabel": "Groq API key",
					"groupId": "groq",
					"groupLabel": "Groq",
					"groupHint": "Fast OpenAI-compatible inference",
					"optionKey": "groqApiKey",
					"cliFlag": "--groq-api-key",
					"cliOption": "--groq-api-key <key>",
					"cliDescription": "Groq API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": { "mediaUnderstandingProviders": ["groq"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/groq-provider",
				"npmSpec": "@testclaw/groq-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/kilocode-provider",
		"description": "Assistant Kilo Gateway provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "kilocode",
				"label": "Kilo Gateway"
			},
			"providers": [{
				"id": "kilocode",
				"name": "Kilo Gateway",
				"docs": "/providers/kilocode",
				"categories": ["cloud", "llm"],
				"envVars": ["KILOCODE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "kilocode-api-key",
					"choiceLabel": "Kilo Gateway API key",
					"choiceHint": "API key (OpenRouter-compatible)",
					"groupId": "kilocode",
					"groupLabel": "Kilo Gateway",
					"groupHint": "API key (OpenRouter-compatible)",
					"optionKey": "kilocodeApiKey",
					"cliFlag": "--kilocode-api-key",
					"cliOption": "--kilocode-api-key <key>",
					"cliDescription": "Kilo Gateway API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/kilocode-provider",
				"npmSpec": "@testclaw/kilocode-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/kimi-provider",
		"description": "Assistant Kimi provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "kimi",
				"label": "Kimi Coding"
			},
			"providers": [{
				"id": "kimi",
				"aliases": ["kimi-coding"],
				"name": "Kimi Coding",
				"docs": "/providers/moonshot",
				"categories": ["cloud", "llm"],
				"envVars": ["KIMI_API_KEY", "KIMICODE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "kimi-code-api-key",
					"choiceLabel": "Kimi Code API key (subscription)",
					"groupId": "moonshot",
					"groupLabel": "Moonshot AI (Kimi K2.6)",
					"groupHint": "Kimi K2.6",
					"optionKey": "kimiCodeApiKey",
					"cliFlag": "--kimi-code-api-key",
					"cliOption": "--kimi-code-api-key <key>",
					"cliDescription": "Kimi Code API key (subscription)",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/kimi-provider",
				"npmSpec": "@testclaw/kimi-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/opencode-go-provider",
		"description": "Assistant OpenCode Go provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "opencode-go",
				"label": "OpenCode Go"
			},
			"providerEndpoints": [{
				"endpointClass": "opencode-go-native",
				"baseUrls": ["https://opencode.ai/zen/go", "https://opencode.ai/zen/go/v1"]
			}],
			"providers": [{
				"id": "opencode-go",
				"name": "OpenCode Go",
				"docs": "/providers/opencode-go",
				"categories": ["cloud", "llm"],
				"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "opencode-go",
					"choiceLabel": "OpenCode Go catalog",
					"groupId": "opencode",
					"groupLabel": "OpenCode",
					"groupHint": "Shared API key for Zen + Go catalogs",
					"optionKey": "opencodeGoApiKey",
					"cliFlag": "--opencode-go-api-key",
					"cliOption": "--opencode-go-api-key <key>",
					"cliDescription": "OpenCode API key (Go catalog)",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": { "mediaUnderstandingProviders": ["opencode-go"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/opencode-go-provider",
				"npmSpec": "@testclaw/opencode-go-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/pixverse-provider",
		"description": "Assistant PixVerse video provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "pixverse",
				"label": "PixVerse"
			},
			"providers": [{
				"id": "pixverse",
				"name": "PixVerse",
				"docs": "/providers/pixverse",
				"categories": ["cloud", "video"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "pixverse-api-key",
					"choiceLabel": "PixVerse API key",
					"choiceHint": "Wizard prompts for International or CN endpoint.",
					"groupId": "pixverse",
					"groupLabel": "PixVerse",
					"groupHint": "Video generation",
					"optionKey": "pixverseApiKey",
					"cliFlag": "--pixverse-api-key",
					"cliOption": "--pixverse-api-key <key>",
					"cliDescription": "PixVerse API key",
					"onboardingScopes": ["image-generation"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/pixverse-provider",
				"npmSpec": "@testclaw/pixverse-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.26"
			}
		}
	},
	{
		"name": "@testclaw/qianfan-provider",
		"description": "Assistant Qianfan provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "qianfan",
				"label": "Qianfan"
			},
			"providers": [{
				"id": "qianfan",
				"name": "Qianfan",
				"docs": "/providers/qianfan",
				"categories": ["cloud", "llm"],
				"envVars": ["QIANFAN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "qianfan-api-key",
					"choiceLabel": "Qianfan API key",
					"groupId": "qianfan",
					"groupLabel": "Qianfan",
					"groupHint": "API key",
					"optionKey": "qianfanApiKey",
					"cliFlag": "--qianfan-api-key",
					"cliOption": "--qianfan-api-key <key>",
					"cliDescription": "QIANFAN API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/qianfan-provider",
				"npmSpec": "@testclaw/qianfan-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/qwen-provider",
		"description": "Assistant Qwen Cloud provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "qwen",
				"label": "Qwen Cloud"
			},
			"providerEndpoints": [{
				"endpointClass": "modelstudio-native",
				"baseUrls": [
					"https://coding-intl.dashscope.aliyuncs.com/v1",
					"https://coding.dashscope.aliyuncs.com/v1",
					"https://dashscope.aliyuncs.com/compatible-mode/v1",
					"https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
					"https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
					"https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1"
				]
			}],
			"providers": [
				{
					"id": "qwen",
					"aliases": [
						"qwencloud",
						"modelstudio",
						"dashscope"
					],
					"name": "Qwen Cloud",
					"docs": "/providers/qwen",
					"categories": ["cloud", "llm"],
					"envVars": [
						"QWEN_API_KEY",
						"MODELSTUDIO_API_KEY",
						"DASHSCOPE_API_KEY"
					],
					"authChoices": [
						{
							"method": "standard-api-key-cn",
							"choiceId": "qwen-standard-api-key-cn",
							"deprecatedChoiceIds": ["modelstudio-standard-api-key-cn"],
							"choiceLabel": "Standard API Key for China (pay-as-you-go)",
							"choiceHint": "Endpoint: dashscope.aliyuncs.com",
							"groupId": "qwen",
							"groupLabel": "Qwen Cloud",
							"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
							"optionKey": "modelstudioStandardApiKeyCn",
							"cliFlag": "--modelstudio-standard-api-key-cn",
							"cliOption": "--modelstudio-standard-api-key-cn <key>",
							"cliDescription": "Qwen Cloud standard API key (China)",
							"onboardingScopes": ["text-inference"]
						},
						{
							"method": "standard-api-key",
							"choiceId": "qwen-standard-api-key",
							"deprecatedChoiceIds": ["modelstudio-standard-api-key"],
							"choiceLabel": "Standard API Key for Global/Intl (pay-as-you-go)",
							"choiceHint": "Endpoint: dashscope-intl.aliyuncs.com",
							"groupId": "qwen",
							"groupLabel": "Qwen Cloud",
							"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
							"optionKey": "modelstudioStandardApiKey",
							"cliFlag": "--modelstudio-standard-api-key",
							"cliOption": "--modelstudio-standard-api-key <key>",
							"cliDescription": "Qwen Cloud standard API key (Global/Intl)",
							"onboardingScopes": ["text-inference"]
						},
						{
							"method": "api-key-cn",
							"choiceId": "qwen-api-key-cn",
							"deprecatedChoiceIds": ["modelstudio-api-key-cn"],
							"choiceLabel": "Coding Plan API Key for China (subscription)",
							"choiceHint": "Endpoint: coding.dashscope.aliyuncs.com",
							"groupId": "qwen",
							"groupLabel": "Qwen Cloud",
							"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
							"optionKey": "modelstudioApiKeyCn",
							"cliFlag": "--modelstudio-api-key-cn",
							"cliOption": "--modelstudio-api-key-cn <key>",
							"cliDescription": "Qwen Cloud Coding Plan API key (China)",
							"onboardingScopes": ["text-inference"]
						},
						{
							"method": "api-key",
							"choiceId": "qwen-api-key",
							"deprecatedChoiceIds": ["modelstudio-api-key"],
							"choiceLabel": "Coding Plan API Key for Global/Intl (subscription)",
							"choiceHint": "Endpoint: coding-intl.dashscope.aliyuncs.com",
							"groupId": "qwen",
							"groupLabel": "Qwen Cloud",
							"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
							"optionKey": "modelstudioApiKey",
							"cliFlag": "--modelstudio-api-key",
							"cliOption": "--modelstudio-api-key <key>",
							"cliDescription": "Qwen Cloud Coding Plan API key (Global/Intl)",
							"onboardingScopes": ["text-inference"]
						}
					]
				},
				{
					"id": "qwen-token-plan",
					"name": "Qwen Token Plan",
					"docs": "/providers/qwen",
					"categories": ["cloud", "llm"],
					"envVars": ["QWEN_TOKEN_PLAN_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "qwen-token-plan",
						"choiceLabel": "Qwen Token Plan (Global/Intl)",
						"choiceHint": "Endpoint: token-plan.ap-southeast-1.maas.aliyuncs.com",
						"groupId": "qwen",
						"groupLabel": "Qwen Cloud",
						"groupHint": "Standard / Coding Plan / Token Plan",
						"optionKey": "qwenTokenPlanApiKey",
						"cliFlag": "--qwen-token-plan-api-key",
						"cliOption": "--qwen-token-plan-api-key <key>",
						"cliDescription": "Qwen Token Plan API key (Global/Intl)",
						"onboardingScopes": ["text-inference"]
					}, {
						"method": "api-key-cn",
						"choiceId": "qwen-token-plan-cn",
						"choiceLabel": "Qwen Token Plan (China)",
						"choiceHint": "Endpoint: token-plan.cn-beijing.maas.aliyuncs.com",
						"groupId": "qwen",
						"groupLabel": "Qwen Cloud",
						"groupHint": "Standard / Coding Plan / Token Plan",
						"optionKey": "qwenTokenPlanApiKeyCn",
						"cliFlag": "--qwen-token-plan-api-key-cn",
						"cliOption": "--qwen-token-plan-api-key-cn <key>",
						"cliDescription": "Qwen Token Plan API key (China)",
						"onboardingScopes": ["text-inference"]
					}]
				},
				{
					"id": "bailian-token-plan",
					"name": "Alibaba Token Plan (legacy custom config)",
					"docs": "/providers/qwen",
					"categories": ["cloud", "llm"]
				}
			],
			"contracts": {
				"mediaUnderstandingProviders": ["qwen"],
				"videoGenerationProviders": ["qwen"]
			},
			"install": {
				"clawhubSpec": "clawhub:@testclaw/qwen-provider",
				"npmSpec": "@testclaw/qwen-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@testclaw/radius-provider",
		"description": "Assistant Radius model gateway provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "radius",
				"label": "Radius"
			},
			"providers": [{
				"id": "radius",
				"name": "Radius",
				"docs": "/providers/radius",
				"categories": ["cloud", "llm"],
				"envVars": ["RADIUS_API_KEY"],
				"authChoices": [{
					"method": "oauth",
					"choiceId": "radius",
					"choiceLabel": "Radius (browser sign-in)",
					"groupId": "radius",
					"groupLabel": "Radius",
					"groupHint": "Browser sign-in or API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "api-key",
					"choiceId": "radius-api-key",
					"choiceLabel": "Radius API key",
					"groupId": "radius",
					"groupLabel": "Radius",
					"groupHint": "Browser sign-in or API key",
					"optionKey": "radiusApiKey",
					"cliFlag": "--radius-api-key",
					"cliOption": "--radius-api-key <key>",
					"cliDescription": "Radius organization API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/radius-provider",
				"npmSpec": "@testclaw/radius-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.9.4"
			}
		}
	},
	{
		"name": "@testclaw/fireworks-provider",
		"description": "Assistant Fireworks provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "fireworks",
				"label": "Fireworks"
			},
			"providers": [{
				"id": "fireworks",
				"aliases": ["fireworks-ai"],
				"name": "Fireworks",
				"docs": "/providers/fireworks",
				"categories": ["cloud", "llm"],
				"envVars": ["FIREWORKS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "fireworks-api-key",
					"choiceLabel": "Fireworks API key",
					"choiceHint": "API key",
					"groupId": "fireworks",
					"groupLabel": "Fireworks",
					"groupHint": "API key",
					"optionKey": "fireworksApiKey",
					"cliFlag": "--fireworks-api-key",
					"cliOption": "--fireworks-api-key <key>",
					"cliDescription": "Fireworks API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/fireworks-provider",
				"npmSpec": "@testclaw/fireworks-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@testclaw/moonshot-provider",
		"description": "Assistant Moonshot provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "moonshot",
				"label": "Moonshot"
			},
			"providerEndpoints": [{
				"endpointClass": "moonshot-native",
				"baseUrls": ["https://api.moonshot.ai/v1", "https://api.moonshot.cn/v1"]
			}],
			"providers": [{
				"id": "moonshot",
				"aliases": ["moonshotai", "moonshot-ai"],
				"name": "Moonshot",
				"docs": "/providers/moonshot",
				"categories": ["cloud", "llm"],
				"envVars": ["MOONSHOT_API_KEY", "KIMI_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "moonshot-api-key",
					"choiceLabel": "Moonshot API key (.ai)",
					"choiceHint": "Kimi K2.6 + Kimi",
					"groupId": "moonshot",
					"groupLabel": "Moonshot AI (Kimi K2.6)",
					"groupHint": "Kimi K2.6",
					"optionKey": "moonshotApiKey",
					"cliFlag": "--moonshot-api-key",
					"cliOption": "--moonshot-api-key <key>",
					"cliDescription": "Moonshot API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "api-key-cn",
					"choiceId": "moonshot-api-key-cn",
					"choiceLabel": "Moonshot API key (.cn)",
					"choiceHint": "Kimi K2.6 + Kimi",
					"groupId": "moonshot",
					"groupLabel": "Moonshot AI (Kimi K2.6)",
					"groupHint": "Kimi K2.6",
					"optionKey": "moonshotApiKey",
					"cliFlag": "--moonshot-api-key",
					"cliOption": "--moonshot-api-key <key>",
					"cliDescription": "Moonshot API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": {
				"mediaUnderstandingProviders": ["moonshot"],
				"webSearchProviders": ["kimi"]
			},
			"webSearchProviders": [{
				"id": "kimi",
				"label": "Kimi (Moonshot)",
				"hint": "Requires Moonshot / Kimi API key · Moonshot web search",
				"onboardingScopes": ["text-inference"],
				"credentialLabel": "Moonshot / Kimi API key",
				"envVars": ["KIMI_API_KEY", "MOONSHOT_API_KEY"],
				"placeholder": "sk-...",
				"signupUrl": "https://platform.moonshot.cn/",
				"docsUrl": "https://docs.testclaw.ai/tools/web",
				"credentialPath": "plugins.entries.moonshot.config.webSearch.apiKey",
				"autoDetectOrder": 40
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/moonshot-provider",
				"npmSpec": "@testclaw/moonshot-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@testclaw/tencent-provider",
		"description": "Assistant Tencent Cloud provider plugin (TokenHub + Token Plan)",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "tencent",
				"label": "Tencent Cloud"
			},
			"providers": [{
				"id": "tencent-tokenhub",
				"name": "Tencent TokenHub",
				"docs": "/providers/tencent",
				"categories": ["cloud", "llm"],
				"envVars": ["TOKENHUB_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "tokenhub-api-key",
					"choiceLabel": "Tencent TokenHub",
					"choiceHint": "Hy via Tencent TokenHub Gateway",
					"groupId": "tencent",
					"groupLabel": "Tencent Cloud",
					"groupHint": "Tencent TokenHub",
					"optionKey": "tokenhubApiKey",
					"cliFlag": "--tokenhub-api-key",
					"cliOption": "--tokenhub-api-key <key>",
					"cliDescription": "Tencent TokenHub API key",
					"onboardingScopes": ["text-inference"]
				}]
			}, {
				"id": "tencent-tokenplan",
				"name": "Tencent TokenPlan",
				"docs": "/providers/tencent",
				"categories": ["cloud", "llm"],
				"envVars": ["TOKENPLAN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "tokenplan-api-key",
					"choiceLabel": "Tencent TokenPlan",
					"choiceHint": "Hy via Tencent TokenPlan Gateway",
					"groupId": "tencent",
					"groupLabel": "Tencent Cloud",
					"groupHint": "Tencent TokenPlan",
					"optionKey": "tokenplanApiKey",
					"cliFlag": "--tokenplan-api-key",
					"cliOption": "--tokenplan-api-key <key>",
					"cliDescription": "Tencent TokenPlan API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/tencent-provider",
				"npmSpec": "@testclaw/tencent-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@testclaw/venice-provider",
		"description": "Assistant Venice provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "venice",
				"label": "Venice"
			},
			"providers": [{
				"id": "venice",
				"name": "Venice",
				"docs": "/providers/venice",
				"categories": ["cloud", "llm"],
				"envVars": ["VENICE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "venice-api-key",
					"choiceLabel": "Venice AI API key",
					"choiceHint": "Privacy-focused (uncensored models)",
					"groupId": "venice",
					"groupLabel": "Venice AI",
					"groupHint": "Privacy-focused (uncensored models)",
					"optionKey": "veniceApiKey",
					"cliFlag": "--venice-api-key",
					"cliOption": "--venice-api-key <key>",
					"cliDescription": "Venice API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/venice-provider",
				"npmSpec": "@testclaw/venice-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@testclaw/vercel-ai-gateway-provider",
		"description": "Assistant Vercel AI Gateway provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "vercel-ai-gateway",
				"label": "Vercel AI Gateway"
			},
			"providers": [{
				"id": "vercel-ai-gateway",
				"name": "Vercel AI Gateway",
				"docs": "/providers/vercel-ai-gateway",
				"categories": ["cloud", "llm"],
				"envVars": ["AI_GATEWAY_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "ai-gateway-api-key",
					"choiceLabel": "Vercel AI Gateway API key",
					"choiceHint": "API key",
					"groupId": "ai-gateway",
					"groupLabel": "Vercel AI Gateway",
					"groupHint": "API key",
					"optionKey": "aiGatewayApiKey",
					"cliFlag": "--ai-gateway-api-key",
					"cliOption": "--ai-gateway-api-key <key>",
					"cliDescription": "Vercel AI Gateway API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/vercel-ai-gateway-provider",
				"npmSpec": "@testclaw/vercel-ai-gateway-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@testclaw/vydra-provider",
		"description": "Assistant Vydra media provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "vydra",
				"label": "Vydra"
			},
			"providers": [{
				"id": "vydra",
				"name": "Vydra",
				"docs": "/providers/vydra",
				"categories": ["cloud", "media"],
				"envVars": ["VYDRA_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "vydra-api-key",
					"choiceLabel": "Vydra API key",
					"groupId": "vydra",
					"groupLabel": "Vydra",
					"groupHint": "Image, video, and speech",
					"optionKey": "vydraApiKey",
					"cliFlag": "--vydra-api-key",
					"cliOption": "--vydra-api-key <key>",
					"cliDescription": "Vydra API key",
					"onboardingScopes": ["image-generation"]
				}]
			}],
			"contracts": {
				"speechProviders": ["vydra"],
				"imageGenerationProviders": ["vydra"],
				"videoGenerationProviders": ["vydra"]
			},
			"install": {
				"clawhubSpec": "clawhub:@testclaw/vydra-provider",
				"npmSpec": "@testclaw/vydra-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/xiaomi-provider",
		"description": "Assistant Xiaomi provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "xiaomi",
				"label": "Xiaomi"
			},
			"providerEndpoints": [{
				"endpointClass": "xiaomi-native",
				"hosts": [
					"api.xiaomimimo.com",
					"token-plan-ams.xiaomimimo.com",
					"token-plan-cn.xiaomimimo.com",
					"token-plan-sgp.xiaomimimo.com"
				]
			}],
			"providers": [{
				"id": "xiaomi",
				"name": "Xiaomi",
				"docs": "/providers/xiaomi",
				"categories": ["cloud", "llm"],
				"envVars": ["XIAOMI_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "xiaomi-api-key",
					"choiceLabel": "Xiaomi API key (Pay-as-you-go)",
					"choiceHint": "Endpoint: api.xiaomimimo.com/v1",
					"groupId": "xiaomi",
					"groupLabel": "Xiaomi",
					"groupHint": "Pay-as-you-go / Token Plan",
					"optionKey": "xiaomiApiKey",
					"cliFlag": "--xiaomi-api-key",
					"cliOption": "--xiaomi-api-key <key>",
					"cliDescription": "Xiaomi MiMo pay-as-you-go API key",
					"onboardingScopes": ["text-inference"]
				}]
			}, {
				"id": "xiaomi-token-plan",
				"name": "Xiaomi Token Plan",
				"docs": "/providers/xiaomi",
				"categories": ["cloud", "llm"],
				"envVars": ["XIAOMI_TOKEN_PLAN_API_KEY"],
				"authChoices": [
					{
						"method": "token-plan-ams",
						"choiceId": "xiaomi-token-plan-ams",
						"choiceLabel": "Xiaomi Token Plan (Europe)",
						"choiceHint": "Endpoint preset: token-plan-ams.xiaomimimo.com/v1",
						"groupId": "xiaomi",
						"groupLabel": "Xiaomi",
						"groupHint": "Pay-as-you-go / Token Plan",
						"optionKey": "xiaomiTokenPlanApiKey",
						"cliFlag": "--xiaomi-token-plan-api-key",
						"cliOption": "--xiaomi-token-plan-api-key <key>",
						"cliDescription": "Xiaomi MiMo Token Plan API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "token-plan-cn",
						"choiceId": "xiaomi-token-plan-cn",
						"choiceLabel": "Xiaomi Token Plan (China)",
						"choiceHint": "Endpoint preset: token-plan-cn.xiaomimimo.com/v1",
						"groupId": "xiaomi",
						"groupLabel": "Xiaomi",
						"groupHint": "Pay-as-you-go / Token Plan",
						"optionKey": "xiaomiTokenPlanApiKey",
						"cliFlag": "--xiaomi-token-plan-api-key",
						"cliOption": "--xiaomi-token-plan-api-key <key>",
						"cliDescription": "Xiaomi MiMo Token Plan API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "token-plan-sgp",
						"choiceId": "xiaomi-token-plan-sgp",
						"choiceLabel": "Xiaomi Token Plan (Singapore)",
						"choiceHint": "Endpoint preset: token-plan-sgp.xiaomimimo.com/v1",
						"groupId": "xiaomi",
						"groupLabel": "Xiaomi",
						"groupHint": "Pay-as-you-go / Token Plan",
						"optionKey": "xiaomiTokenPlanApiKey",
						"cliFlag": "--xiaomi-token-plan-api-key",
						"cliOption": "--xiaomi-token-plan-api-key <key>",
						"cliDescription": "Xiaomi MiMo Token Plan API key",
						"onboardingScopes": ["text-inference"]
					}
				]
			}],
			"contracts": {
				"speechProviders": ["xiaomi"],
				"usageProviders": ["xiaomi", "xiaomi-token-plan"]
			},
			"install": {
				"clawhubSpec": "clawhub:@testclaw/xiaomi-provider",
				"npmSpec": "@testclaw/xiaomi-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/zai-provider",
		"description": "Assistant Z.AI provider plugin",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "zai",
				"label": "Z.AI"
			},
			"providerEndpoints": [{
				"endpointClass": "zai-native",
				"hosts": ["api.z.ai", "open.bigmodel.cn"]
			}],
			"providers": [{
				"id": "zai",
				"aliases": ["z-ai", "z.ai"],
				"name": "Z.AI",
				"docs": "/providers/zai",
				"categories": ["cloud", "llm"],
				"envVars": ["ZAI_API_KEY", "Z_AI_API_KEY"],
				"authChoices": [
					{
						"method": "api-key",
						"choiceId": "zai-api-key",
						"choiceLabel": "Z.AI API key",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "coding-global",
						"choiceId": "zai-coding-global",
						"choiceLabel": "Coding-Plan-Global",
						"choiceHint": "GLM Coding Plan Global (api.z.ai)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "coding-cn",
						"choiceId": "zai-coding-cn",
						"choiceLabel": "Coding-Plan-CN",
						"choiceHint": "GLM Coding Plan CN (open.bigmodel.cn)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "global",
						"choiceId": "zai-global",
						"choiceLabel": "Global",
						"choiceHint": "Z.AI Global (api.z.ai)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "cn",
						"choiceId": "zai-cn",
						"choiceLabel": "CN",
						"choiceHint": "Z.AI CN (open.bigmodel.cn)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					}
				]
			}],
			"contracts": { "mediaUnderstandingProviders": ["zai"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/zai-provider",
				"npmSpec": "@testclaw/zai-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@testclaw/synthetic-provider",
		"description": "Assistant Synthetic provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "synthetic",
				"label": "Synthetic"
			},
			"providers": [{
				"id": "synthetic",
				"name": "Synthetic",
				"docs": "/providers/synthetic",
				"categories": ["cloud", "llm"],
				"envVars": ["SYNTHETIC_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "synthetic-api-key",
					"choiceLabel": "Synthetic API key",
					"groupId": "synthetic",
					"groupLabel": "Synthetic",
					"groupHint": "Anthropic-compatible (multi-model)",
					"optionKey": "syntheticApiKey",
					"cliFlag": "--synthetic-api-key",
					"cliOption": "--synthetic-api-key <key>",
					"cliDescription": "Synthetic API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/synthetic-provider",
				"npmSpec": "@testclaw/synthetic-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/voyage-provider",
		"description": "Assistant Voyage embedding provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "voyage",
				"label": "Voyage"
			},
			"providers": [{
				"id": "voyage",
				"name": "Voyage",
				"docs": "/reference/memory-config",
				"categories": ["cloud"],
				"envVars": ["VOYAGE_API_KEY"]
			}],
			"contracts": { "embeddingProviders": ["voyage"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/voyage-provider",
				"npmSpec": "@testclaw/voyage-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/volcengine-provider",
		"description": "Assistant Volcengine provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "volcengine",
				"label": "Volcengine"
			},
			"providers": [{
				"id": "volcengine",
				"aliases": ["volcengine-plan"],
				"name": "Volcengine",
				"docs": "/providers/volcengine",
				"categories": ["cloud", "llm"],
				"envVars": ["VOLCANO_ENGINE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "volcengine-api-key",
					"choiceLabel": "Volcano Engine API key",
					"groupId": "volcengine",
					"groupLabel": "Volcano Engine",
					"groupHint": "API key",
					"optionKey": "volcengineApiKey",
					"cliFlag": "--volcengine-api-key",
					"cliOption": "--volcengine-api-key <key>",
					"cliDescription": "Volcano Engine API key",
					"onboardingScopes": ["text-inference"]
				}]
			}, {
				"id": "volcengine-plan",
				"name": "Volcengine Plan",
				"docs": "/providers/volcengine",
				"categories": ["cloud", "llm"],
				"envVars": ["VOLCANO_ENGINE_API_KEY"]
			}],
			"contracts": { "speechProviders": ["volcengine"] },
			"install": {
				"clawhubSpec": "clawhub:@testclaw/volcengine-provider",
				"npmSpec": "@testclaw/volcengine-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.7.2"
			}
		}
	},
	{
		"name": "@testclaw/stepfun-provider",
		"description": "Assistant StepFun provider plugin.",
		"source": "official",
		"kind": "provider",
		"testclaw": {
			"plugin": {
				"id": "stepfun",
				"label": "StepFun"
			},
			"providers": [{
				"id": "stepfun",
				"name": "StepFun",
				"docs": "/providers/stepfun",
				"categories": ["cloud", "llm"],
				"envVars": ["STEPFUN_API_KEY"],
				"authChoices": [{
					"method": "standard-api-key-cn",
					"choiceId": "stepfun-standard-api-key-cn",
					"choiceLabel": "StepFun Standard API key (China)",
					"choiceHint": "Endpoint: api.stepfun.com/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "standard-api-key-intl",
					"choiceId": "stepfun-standard-api-key-intl",
					"choiceLabel": "StepFun Standard API key (Global/Intl)",
					"choiceHint": "Endpoint: api.stepfun.ai/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}]
			}, {
				"id": "stepfun-plan",
				"name": "StepFun stepfun plan",
				"docs": "/providers/stepfun",
				"categories": ["cloud", "llm"],
				"envVars": ["STEPFUN_API_KEY"],
				"authChoices": [{
					"method": "plan-api-key-cn",
					"choiceId": "stepfun-plan-api-key-cn",
					"choiceLabel": "StepFun Step Plan API key (China)",
					"choiceHint": "Endpoint: api.stepfun.com/step_plan/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "plan-api-key-intl",
					"choiceId": "stepfun-plan-api-key-intl",
					"choiceLabel": "StepFun Step Plan API key (Global/Intl)",
					"choiceHint": "Endpoint: api.stepfun.ai/step_plan/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@testclaw/stepfun-provider",
				"npmSpec": "@testclaw/stepfun-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	}
] };
//#endregion
export { official_external_provider_catalog_default as t };
