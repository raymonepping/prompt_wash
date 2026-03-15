#!/bin/bash

# --- Configuration ---
VERSION="1.5.0" # Incremented for the new API structure

# --- Functions ---
show_help() {
  echo "Usage: ./scripts/setup_structure.sh [options]"
  echo ""
  echo "Populates the current directory with the promptwash architecture, documentation, and API layers."
  echo ""
  echo "Options:"
  echo "  --help     Show this help message"
  echo "  --version  Show script version"
}

# --- Argument Parsing ---
case "$1" in
--help)
  show_help
  exit 0
  ;;
--version)
  echo "promptwash-scaffolder v$VERSION"
  exit 0
  ;;
esac

echo "🛠️  Expanding promptwash structure with API layers and documentation..."

# 1. Create Base and Original Directories
mkdir -p bin docs src/{commands,pipeline,ir,ollama,constraints,config,repo,utils}

# 2. Create NEW API Directory Structure
mkdir -p api/{controllers,middleware,routes,services}

# 3. Create Documentation (14 files total)
touch docs/{INDEX,README,SCOPE,REQUIREMENTS,ARCHITECTURE,CLI,PROMPT_IR,PHILOSOPHY,CONSTRAINTS,ROADMAP,CONTRIBUTING,DISCLOSURE,CHANGELOG}.md

# 4. Create CLI Entry & Root API
touch bin/promptwash.js
touch src/index.js

# 5. Populate API Root and Middleware
touch api/server.js
touch api/middleware/{error-handler.js,not-found.js}

# 6. Populate API Feature Layers (Workspace, Experiments, Intelligence, Governance)
# Using a loop to keep the script clean and maintainable
FEATURES=("workspace" "experiments" "intelligence" "governance")

for feature in "${FEATURES[@]}"; do
  touch "api/controllers/${feature}.js"
  touch "api/routes/${feature}.js"
  touch "api/services/${feature}.js"
done

# 7. Create Original CLI Command Handlers
touch src/commands/{parse,render,check,repo,constraints,config}.js

# 8. Create Original Pipeline Stages
touch src/pipeline/{normalize,clean,enrich,lint,analyze,adapt,index}.js

# 9. Create Original Core Modules & Utilities
touch src/ir/schema.js
touch src/ollama/client.js
touch src/constraints/loader.js
touch src/config/loader.js
touch src/repo/manager.js
touch src/utils/{display,tokens,fingerprint,input,errors}.js

# 10. Set Permissions
chmod +x bin/promptwash.js

echo "✅ Full project structure built successfully in $(pwd)"
echo "🚀 API Layer added: Controllers, Routes, Services, and Middleware."
echo "📚 14 documentation files generated in ./docs/"
