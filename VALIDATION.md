# Installation checks

The public distribution was checked locally on 4 November 2026 with Node.js 24.2.0 and the available local MariaDB server.

- `npm ci --ignore-scripts --no-audit --no-fund` installed the locked dependencies in a clean publication folder.
- `npm run configure` generated private configurations from the public examples and environment settings.
- The SQL script was imported into a newly created, isolated test schema. The five expected tables were created. That test schema was removed after verification; the existing application database was not modified.
- Both servers started on temporary test ports. The PTGenAI entry page and the Users List, Persons Edit, Persons Pills, Person Statistics, Employee Cards, and Positions List endpoints returned HTTP 200 and nonempty rendered content.
- No paid model request was sent. Model access, generated-output quality, version-management scenarios, and an end-to-end evaluation remain separate checks.

Two export defects in the original SQL dump were corrected for installation: an invalid `DEFAULT AUTO_INCREMENT` table option was changed to `AUTO_INCREMENT`, and a primary key was added to the auto-increment `metric.ID` column.

These are installation checks of this distributed artifact. They are not an independent replication of the manuscript's historical editing observations or a new empirical validation of its claims.
