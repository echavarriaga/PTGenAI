# PTGenAI

### Runtime web interface editing with RestRho, JSON DSLs, and language models

**PTGenAI** (Portable Testing GenAI Rho) is the case-study application for the manuscript **Runtime editing of web interfaces using JSON DSLs and LLM assisted template transformations**. This repository provides the source code needed to inspect the implementation, run its database-backed views, and conduct new tests of conversational template editing.

The application combines **RestRho** on the server, **RhoPortable** and its JSON-based **PRho** language on the client, and **RhoLLM** for requesting template changes and inspecting and managing template versions. RhoEngine interprets the declarative programs, and Handlebars renders the templates.

## How it works

```text
Browser / PRho → RestRho → MariaDB → Handlebars → Rendered interface
                     ↕
           Language model / template editing
```

Stable page and service declarations are kept separate from the templates being edited. The user requests a change, the server submits the current template and instructions to the configured model, and the returned template is rendered through the application workflow. Editing scope is specified through prompts; the implementation does not enforce constrained decoding or independently validate generated templates against a formal grammar.

| Component | Responsibility |
| --- | --- |
| RhoEngine | Interprets JSON-based domain-specific languages and connects their elements to JavaScript implementations. |
| RestRho / DBRestRho | Connects HTTP requests, database-backed services, model requests, and response generation. |
| SQLRho | Declares database operations and associates results with templates. |
| RhoPortable / PRho | Defines client-side pages, navigation, fragments, and REST contexts. |
| RhoLLM | Provides conversational template editing, inspection, and version controls. |

## Requirements

- **Node.js 22 or later** and npm. The local runtime was checked with Node.js 24.2.0.
- **MariaDB Server** running locally or on a reachable host, and the `mariadb` command-line client. MariaDB is required for the data-backed views.
- A database account with access to the test schema. Creating the schema requires suitable database privileges.
- For model-based editing: an OpenAI API key, access to the configured model, and an Internet connection. Provider usage may incur charges.

The web server uses port **8090** and the RestRho API uses port **3000**, both bound to the local machine. Start one instance of each server.

## Installation

### 1. Download the code and install dependencies

```sh
git clone https://github.com/echavarriaga/PTGenAI.git
cd PTGenAI
npm ci
```

The repository includes `package-lock.json` and exact direct dependency versions for the software environment supplied here. These identify this release environment; they do not establish the complete environment of every historical experiment.

### 2. Create and populate the MariaDB test database

The [scripts/samplerestrho.sql](scripts/samplerestrho.sql) dump contains the `position`, `employee`, `metric`, `person`, and `user` tables and sample records. It does not create or select the database itself.

From the repository root, connect using an account that can create the test schema:

```sh
mariadb --host=127.0.0.1 --user=YOUR_DB_USER --password
```

At the MariaDB prompt:

```sql
CREATE DATABASE samplerestrho CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE samplerestrho;
SOURCE scripts/samplerestrho.sql;
SHOW TABLES;
```

Use a fresh test schema. The dump inserts records and is not intended for repeated imports into an already populated database. Its application accounts and sample passwords are for demonstration use only and are separate from MariaDB server accounts. See the [MariaDB client documentation](https://mariadb.com/docs/server/clients-and-utilities/mariadb-client/mariadb-command-line-client) for import options.

### 3. Configure the database and language model

Copy `.env.example` to `.env`. In PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS or Linux:

```sh
cp .env.example .env
```

Edit `.env` with your database account and, for conversational editing, your API key:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=samplerestrho
DB_USER=ptgenai
DB_PASSWORD=YOUR_DATABASE_PASSWORD
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5.1
```

`DB_USER` must name an existing MariaDB account with privileges on `samplerestrho`; the SQL dump does not create that account. Then run:

```sh
npm run configure
```

This generates `rest2/rest/rho.json` and `rest2/db/programming.mariadb.json` from the public example configurations. `.env`, generated private configurations, logs, and saved user versions are excluded from Git. Run the configuration command again after changing `.env`, and restart the API. Without a valid model key, database-backed views can still be tested, but model requests will not succeed.

### 4. Start the two servers

In the first terminal, from the repository root:

```sh
node server.js
```

In the second terminal:

```sh
cd rest2
node ./server.js
```

Open **[http://localhost:8090/PTGenAI.html](http://localhost:8090/PTGenAI.html)**. The API is available at `http://localhost:3000`.

On Windows, the supplied `Start-Servers.ps1` can start both processes in the background, and `Stop-Servers.ps1` stops the processes recorded by that script. If you see `EADDRINUSE`, another process already owns the port; use the running instance or stop that identified instance before restarting.

## Trying the application

The home page links to Users List, Sign-in, Persons Edit, Persons Pills, Person Statistics, Employee Cards, and Positions List. To try conversational editing:

1. Open a view such as **Persons Pills**.
2. Open its chat panel using the robot button.
3. Request a small template change, such as changing the title or a colour.
4. Inspect the rendered result and use the available template and version controls to review, save, or restore a view.

Assess template syntax, renderability, and semantic acceptability separately. Rendering a response successfully does not establish semantic correctness, accessibility, or security. Keep model requests and testing confined to demonstration data.

## Support for the manuscript

This repository makes the implementation, PRho configuration, server-side operation declarations, templates, system prompt, and test database script available for external inspection and new evaluations. The Programming operation uses the `gpt-5.1` alias by default, with the provider-default parameter policy unless the supplied configuration specifies an override. The fixed system prompt is in [rest2/prompt/web/programming.txt](rest2/prompt/web/programming.txt); the request prompt and operation settings are in [rest2/config/rho.example.json](rest2/config/rho.example.json).

Publishing this artifact is not evidence that an independent validation has already been performed. Reproducing the historical results additionally requires complete per-attempt inputs, conversation histories, raw outputs, rendering traces, assessment records, and an identifiable model configuration. This repository does not supply a complete archive of those historical records, a Docker image, or an unrestricted-LLM comparison. The model alias is not an immutable snapshot, and new requests may produce different outputs.

When reporting a new evaluation, record the repository commit, runtime and database versions, model identifier, effective request parameters, input template, instruction, history, raw response, rendering result, and assessment for each attempt. Report new tests separately from the manuscript's historical observations.

## Source layout

| Path | Contents |
| --- | --- |
| `server.js` | Web server on port 8090. |
| `public_html/PTGenAI.html` | Application entry page. |
| `public_html/programs/programming.json` | PRho application configuration. |
| `public_html/js/` | Client RhoEngine, RhoPortable/RhoLLM, and required libraries. |
| `public_html/templates/programming/` | Chat and error templates. |
| `rho/Rho2.js` | Server-side RhoEngine. |
| `rest2/server.js`, `rest2/RestRho2.js` | API entry point and implementation. |
| `rest2/config/` | Public configuration examples without local credentials. |
| `rest2/templates/programming/` | Server-rendered views. |
| `rest2/prompt/web/programming.txt` | Programming system prompt. |
| `scripts/configure.js` | Generates local configurations from environment settings. |
| `scripts/samplerestrho.sql` | Test schema tables and sample data. |

The distribution excludes installed dependencies, editor settings, local credentials, logs, saved user histories, and the obsolete `public_html/portable` backup. The `npm test` script is not a test suite; installation checks are described in [VALIDATION.md](VALIDATION.md).

## Documentation and publications

- [DevRho: RhoEngine and JSON-based domain-specific languages](https://devrho.com/).
- [RestRho: A JSON-Based Domain-Specific Language for Designing and Developing RESTful APIs to Validate RhoArchitecture](https://doi.org/10.3390/fi17080346), *Future Internet* 17(8), 346 (2025).
- Associated manuscript: *Runtime editing of web interfaces using JSON DSLs and LLM assisted template transformations* (revised manuscript).

## Author and license

**Enrique Chavarriaga** · [GitHub](https://github.com/echavarriaga) · [DevRho](https://devrho.com/) · [contact@devrho.com](mailto:contact@devrho.com).

See [LICENSE](LICENSE). Individual source headers and third-party library notices retain their respective licensing terms.
