niskala/
│
├── README.md                     # Dokumentasi utama
├── LICENSE                       # MIT License
├── .gitignore                    # File yang tidak di-commit
├── .env.example                  # Template environment variables
│
├── ui-globe/                     # 🌍 Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   ├── config.js                 # ⚠️ JANGAN commit — ada API key
│   ├── config.example.js         # ✅ Template tanpa key
│   ├── mapbox.js
│   ├── app.js
│   ├── company_coords.js
│   ├── chokepoints.js
│   └── assets/
│       ├── logo.svg
│       └── screenshot.png
│
├── langflow-flows/               # 🧠 Langflow Workflows (JSON)
│   ├── niskala-ui.json           # Flow A — JSON-only (UI)
│   ├── niskala-report.json       # Flow B — Markdown-only (Human)
│   └── README.md                 # Cara import flow
│
├── docs/                         # 📚 Dokumentasi
│   ├── architecture.md           # Diagram arsitektur
│   ├── flow-ids.md               # Catatan Flow ID
│   ├── calibration-guide.md      # Cara kalibrasi
│   └── api-reference.md          # Jika ada API publik
│
├── backups/                      # 💾 Backup berkala
│   ├── calibration-2026-09-27.json
│   └── predictions-2026-09-27.json
│
└── scripts/                      # 🔧 Utility scripts (opsional)
    ├── deploy.sh
    └── backup.sh
    