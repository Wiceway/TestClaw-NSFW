# Testclaw [NSFW] — автономный AI-агент

Автономный агент с доступом к системе: терминал, файлы, интернет, браузер.
Работает через **DeepSeek API** — нужен свой API-ключ.

> ## ⚠️ ПРЕДУПРЕЖДЕНИЕ / WARNING
>
> **EN:** No built-in safety layer. The system prompt is minimal, there are no
> moderation policies, and the agent has **full host access**
> (`exec.security: "full"`, `ask: "off"`). **Whatever the model generates, the
> agent will output.** The `[NSFW]` tag means there is **no filter between you and
> the model**. The agent can irreversibly modify or delete your data.
> **Run it only in an isolated VM or container.**
>
> **RU:** Нет защитного слоя. Системный промпт минимален, политик модерации нет,
> агенту выдан **полный доступ к системе** (`exec.security: "full"`, `ask: "off"`).
> **Что модель сгенерирует — то агент и выдаст.** Пометка `[NSFW]` означает
> **отсутствие фильтра между вами и моделью**. Агент может безвозвратно удалить
> ваши данные. **Запускайте только в изолированной ВМ или контейнере.**

---

## Содержание

- [Требования](#требования)
- [Установка](#установка)
- [Запуск](#запуск)
- [Удаление](#удаление)
- [Что где лежит](#что-где-лежит)
- [Подробнее о безопасности](#подробнее-о-безопасности)

---

## Требования

| Компонент | Нужно ставить вручную? |
|---|---|
| **Python 3.8+** | ✅ да — [python.org/downloads](https://www.python.org/downloads/) |
| **DeepSeek API-ключ** | ✅ да — [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) |
| Node.js 24 | ❌ нет — скачается при установке |
| npm / pnpm | ❌ не нужны |
| ОС | Linux / macOS / Windows, x64 или arm64 |

На время установки нужен доступ в интернет (скачать Node с nodejs.org).

---

## Установка

Скопируйте **одну** строку для своей ОС — вставите в терминал, дальше всё само.
Установщик спросит ваш DeepSeek-ключ.

### Linux / macOS

```bash
git clone https://github.com/Wiceway/TestClaw-NSFW ~/TestClaw && cd ~/TestClaw && chmod +x install.sh && ./install.sh
```

### Windows (PowerShell)

```powershell
git clone https://github.com/Wiceway/TestClaw-NSFW "$env:USERPROFILE\TestClaw"; cd "$env:USERPROFILE\TestClaw"; .\install.bat
```

### Windows (CMD)

```cmd
git clone https://github.com/Wiceway/TestClaw-NSFW %USERPROFILE%\TestClaw && cd %USERPROFILE%\TestClaw && install.bat
```

---

Установщик:
1. определяет ОС и архитектуру;
2. **спрашивает ваш DeepSeek-ключ** (ввод скрыт);
3. копирует рантайм в `~/TestClawHome`;
4. скачивает Node 24.21.0 под вашу платформу;
5. записывает `.env` и `config/testclaw.json`;
6. на Linux от root — ставит службу `systemd`.

### Варианты установки

Добавьте флаг к той же команде:

| Что нужно | Флаг |
|---|---|
| Всё в одной папке (`./runtime`, легко удалить) | `--portable` |
| Свой каталог | `--home /opt/tc` |
| Без системной службы | `--no-service` |

Пример — всё в одной папке и без службы:

```bash
./install.sh --portable --no-service
```

### Установка без вопросов (для скриптов)

```bash
./install.sh --key "$DEEPSEEK_API_KEY"
```

---

## Запуск

| Способ | Команда |
|---|---|
| Обычная установка, служба (Linux root) | `systemctl start testclaw-gateway` |
| Обычная установка, вручную | `~/TestClawHome/run.sh gateway run` |
| Portable | `./runtime/run.sh gateway run` |

Windows — тот же путь, но `run.cmd`:
```bat
%USERPROFILE%\TestClawHome\run.cmd gateway run
runtime\run.cmd gateway run
```

Дашборд после запуска: **http://127.0.0.1:18789/**

---

## Удаление

```bash
./uninstall.sh        # Linux / macOS
uninstall.bat         # Windows
```

Убирает рантайм и (на Linux) службу `systemd`, если она относится к этой
установке. Папку репозитория не трогает — для полного удаления добавьте `--clone`.

**Вручную:** удалите `~/TestClawHome` (или `./runtime` в portable) и папку клона.

---

## Что где лежит

**В репозитории:**

```
app/                  рантайм (dist + node_modules + лаунчер)
templates/            шаблоны конфигов (без ключа)
setup.py              установщик
uninstall.py          деинсталлятор
install.sh / .bat     обёртки установки
uninstall.sh / .bat   обёртки удаления
```

**После установки** (`$TESTCLAW_HOME` = `~/TestClawHome` или `./runtime`):

```
bin/              рантайм + Node для вашей платформы
config/           testclaw.json  — тут ключ
.env              переменные окружения — тут ключ
workspace/        рабочее пространство агента
state/  logs/     сессии, логи
run.sh / run.cmd  лаунчер
```

---

## Подробнее о безопасности

Сборка идёт **без защитного слоя** — это её суть, а не баг:

- **Системный промпт пуст.** Агенту передаётся только текущая дата — никаких
  инструкций о роли, границах или безопасности.
- **Политик модерации нет.** Ограничением является только сама модель DeepSeek;
  её собственные фильтры работают, но **своего** слоя у Testclaw нет.
- **Полный доступ.** `exec.security: "full"` и `ask: "off"` — агент выполняет
  shell-команды без подтверждений.

Поэтому поведение **легковеснее, быстрее и менее предсказуемо**: что модель
сгенерирует — то агент и сделает, включая необратимые изменения на вашей машине.

**Хотите ограничить** — в `config/testclaw.json`:

```json
{
  "tools": {
    "exec": { "security": "restricted", "ask": "on" }
  }
}
```

Дашборд по умолчанию слушает только `127.0.0.1`. Перед публикацией в интернет
поставьте его за обратный прокси (nginx/Caddy) с TLS. Никогда не коммитьте
`.env` и `config/testclaw.json` — в них ваш ключ.

---

## Лицензия

MIT
