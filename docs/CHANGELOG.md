# Changelog

All notable changes to PromptWash will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-06-12

### Added
- **API Endpoints**:
  - `GET /api/runs/latest` - Get the most recent execution run
  - `POST /api/governance/risk` - Ad-hoc risk analysis for prompts
  - `POST /api/governance/bias` - Ad-hoc bias analysis for prompts
- **Request Validation**:
  - Added comprehensive validation middleware for all API endpoints
  - Input sanitization to prevent injection attacks
  - Schema validation for workspace, experiment, and governance requests
- **Testing Infrastructure**:
  - Vitest test framework configuration
  - Test setup and utilities
  - Sample tests for pipeline and API validation
  - Coverage reporting configured (70% threshold)
- **Documentation**:
  - Comprehensive API documentation (`docs/API.md`)
  - API audit report (`docs/API_AUDIT_REPORT.md`)
  - Progress tracking document (`docs/TRACK_PROGRESS.md`)
- **Development**:
  - Added `npm run test` script
  - Added `npm run test:coverage` script
  - Added `npm run api` script to start API server

### Changed
- Updated `package.json` to version 0.2.0
- Enhanced error handling in runs service with better 404 responses
- Improved governance service with dedicated analysis functions

### Fixed
- Route ordering in runs endpoints (latest before :id to prevent conflicts)
- Validation errors now return consistent error format

### Security
- Added input sanitization middleware
- Null byte removal from string inputs
- Request validation to prevent malformed data

## [0.1.0] - 2026-03-15

### Added
- Initial repository setup
- Core prompt pipeline (normalize, clean, analyze, lint)
- Prompt IR (Intermediate Representation) specification
- Configuration system with environment overrides
- Constraint management system
- Repository integration (Git status, history, diff, publish)
- Governance system (risk and bias detection)
- Lineage tracking for prompt evolution
- Execution engine with Ollama integration
- Deterministic evaluation framework
- Run comparison capabilities
- Prompt optimization engine
- Intelligence analytics layer
- Experiment execution and registry
- CLI with 18 commands
- Express-based REST API
- UI foundation (React + TypeScript + Vite)

### CLI Commands
- `promptwash parse` - Parse raw prompts into structured format
- `promptwash render` - Render prompt variants
- `promptwash check` - Quality check and benchmarking
- `promptwash batch-check` - Batch quality checking
- `promptwash bundle` - Bundle prompts
- `promptwash constraints` - Manage constraints
- `promptwash config` - Configuration management
- `promptwash risk` - Risk analysis
- `promptwash risk-rules` - Manage risk rules
- `promptwash bias` - Bias analysis
- `promptwash bias-rules` - Manage bias rules
- `promptwash lineage` - Lineage tracking
- `promptwash repo` - Repository integration
- `promptwash run` - Execute prompts
- `promptwash runs` - Manage runs
- `promptwash evaluate` - Evaluate run quality
- `promptwash compare-runs` - Compare runs
- `promptwash optimize` - Optimize prompts
- `promptwash intelligence` - Analytics queries
- `promptwash experiment` - Run experiments
- `promptwash experiments` - Manage experiments

### API Endpoints
- `POST /api/workspace/analyze` - Analyze prompts
- `POST /api/workspace/run` - Execute prompts
- `GET /api/workspace/state` - Get workspace state
- `GET /api/runs` - List runs
- `GET /api/runs/:id` - Get specific run
- `GET /api/experiments` - List experiments
- `GET /api/experiments/:id` - Get specific experiment
- `POST /api/experiments/run` - Run experiment
- `GET /api/intelligence/models` - Model intelligence
- `GET /api/intelligence/runs` - Run intelligence
- `GET /api/intelligence/optimization` - Optimization intelligence
- `GET /api/intelligence/lineage` - Lineage intelligence
- `GET /api/governance/rules` - Get governance rules
- `POST /api/governance/rules` - Update governance rules

### Documentation
- Architecture documentation
- Requirements specification
- Roadmap (Phases 1-34)
- CLI documentation
- Philosophy and principles
- Prompt IR specification
- System overview
- UX documentation (Parser Pipeline, Insights System, Workspace State Model)
- UI documentation (Architecture, Components, Roadmap)

## [Unreleased]

### Planned for 0.3.0
- Complete UI implementation (Phase 30)
- Additional API endpoints for CLI parity
- Pagination for list endpoints
- Query parameters for filtering and sorting
- Performance optimizations
- Comprehensive test coverage (>70%)

### Planned for 0.4.0
- Multi-provider execution (OpenAI, Anthropic, Azure)
- Advanced prompt optimization strategies
- Prompt CI integration
- Enhanced lineage visualization

### Planned for 1.0.0
- Production-ready release
- Complete test coverage
- Full documentation
- Performance benchmarks
- Security audit
- Deployment guides

---

## Version History

- **0.2.0** (2026-06-12) - Backend finalization, API enhancements, testing infrastructure
- **0.1.0** (2026-03-15) - Initial release with core functionality

---

## Migration Guides

### Migrating from 0.1.0 to 0.2.0

#### API Changes
- No breaking changes to existing endpoints
- New endpoints added (see Added section)
- Request validation now enforced (may reject previously accepted malformed requests)

#### CLI Changes
- No breaking changes
- All existing commands work as before

#### Configuration Changes
- No configuration changes required
- New test scripts available in package.json

---

## Contributors

- PromptWash Team
- Community Contributors

---

## Links

- [GitHub Repository](https://github.com/promptwash/promptwash)
- [Documentation](./docs/)
- [API Documentation](./docs/API.md)
- [Roadmap](./docs/ROADMAP.md)